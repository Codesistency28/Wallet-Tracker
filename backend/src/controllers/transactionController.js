import { sql } from "../config/db.js";





export const getTransaction = async(req, res) => {
    try {
        const { id } = req.params;

        const transaction = await sql `
      SELECT * 
      FROM transactions 
      WHERE user_id = ${id} 
      ORDER BY created_at DESC
    `;

        res.status(200).json(transaction);
    } catch (error) {
        console.error("Error fetching transaction:", error);
        res.status(500).json({ message: "error", error: error.message });
    }
}



export const transactionSummary = async(req, res) => {
    try {
        const { id } = req.params

        const balanceResult = await sql `
      select coalesce(sum(amount),0) as balance from transactions where user_id = ${id}
    `

        const incomeResult = await sql `
      select coalesce(sum(amount),0) as income from transactions where user_id = ${id} and amount >0
    `

        const expenseResult = await sql `
      select coalesce(sum(amount),0) as expenses from transactions where user_id = ${id} and amount < 0
    `


        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expenseResult[0].expenses
        })
    } catch (error) {
        console.error("Error fetching transaction:", error);
        res.status(500).json({ message: "error", error: error.message });
    }
}