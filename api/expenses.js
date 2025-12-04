// In-memory store (Resets on server restart/cold start)
let expenses = [];

export default function handler(req, res) {
  // 1. Enable CORS (Optional but recommended for APIs)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle Preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        count: expenses.length,
        data: expenses,
      });

    } else if (req.method === 'POST') {
      const { amount, description, category, date } = req.body;

      if (!amount || !description || !category || !date) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields.',
        });
      }

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be a positive number.',
        });
      }

      const newExpense = {
        id: Date.now().toString(), // String ID is safer
        amount: parsedAmount,
        description,
        category,
        date: new Date(date).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };

      expenses.push(newExpense);

      return res.status(201).json({
        success: true,
        data: newExpense,
      });

    } else {
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} Not Allowed`,
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
}
