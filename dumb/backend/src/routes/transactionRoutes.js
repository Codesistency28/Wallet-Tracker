import express from 'express';
import { addTransaction, deleteTransaction, getTransaction, transactionSummary } from '../controllers/transactionController.js';

const transactionRouter = express.Router()

transactionRouter.post("/transactions", addTransaction);

transactionRouter.get("/transactions/:id", getTransaction);

transactionRouter.delete("/transactions/:id", deleteTransaction)

transactionRouter.get("/transactions/summary/:id", transactionSummary)


export default transactionRouter
