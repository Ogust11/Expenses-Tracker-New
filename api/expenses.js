// A simple in-memory array to store expenses.
// NOTE: In a real-world app, you would use a persistent database (like MongoDB, Postgres, etc.).
let expenses = [];

/**
 * Handles incoming API requests to /api/expenses.
 * @param {import('@vercel/node').VercelRequest} req - The request object.
 * @param {import('@vercel/node').VercelResponse} res - The response object.
 */
export default function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // 📝 GET: Return all expenses
      return res.status(200).json({
        success: true,
        count: expenses.length,
        data: expenses,
      });

    } else if (req.method === 'POST') {
      // 📝 POST: Add a new expense
      const { amount, description, category, date } = req.body;

      // ✅ Error Management for missing fields
      if (!amount || !description || !category || !date) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: amount, description, category, and date are required.',
        });
      }

      // ⚙️ Validate amount is a number
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be a positive number.',
        });
      }

      // ➕ Create a new expense object
      const newExpense = {
        id: Date.now(), // Simple unique ID
        amount: parsedAmount,
        description,
        category,
        date: new Date(date).toISOString().split('T')[0], // Standardize date format
        createdAt: new Date().toISOString(),
      };

      // 💾 Add to the in-memory array
      expenses.push(newExpense);

      // 🥳 Send success response
      return res.status(201).json({
        success: true,
        data: newExpense,
      });

    } else {
      // 🚫 Method Not Allowed
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} Not Allowed`,
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error: Could not process the request.',
    });
  }
}
