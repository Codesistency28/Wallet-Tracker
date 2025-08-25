import { sql } from "../config/db.js";


export const addTransaction = async(req, res) => {
    try {
        const { title, amount, category, user_id } = req.body;

        if (!title || !user_id || !category || amount === undefined) {
            return res.status(400).json({ message: "All feilds are required" });
        }

        const transaction = await sql `
      INSERT INTO transactions(user_id,title,amount,category)
      VALUES(${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

        res.status(201).json(transaction[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error" });

    }
}



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

export const deleteTransaction = async(req, res) => {
    try {
        const { id } = req.params

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "Invalid transactions ID"
            })
        }

        const result = await sql `
      DELETE FROM transactions WHERE id =${id} RETURNING *
    `

        if (result.length === 0) {
            return res.status(404).json({
                message: "transaction not found"
            })
        }
        res.status(200).json({
            message: "Transaction deleted successfully"
        })
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