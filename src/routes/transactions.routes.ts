import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionsRepositories = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepositories.find({
    select: ['id', 'title', 'value', 'type', 'category', 'created_at'],
    relations: ['category'],
  });

  const balance = await transactionsRepositories.getBalance();
  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  console.log(transaction);
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO

  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    // TODO
    const importTransactions = new ImportTransactionsService();

    const transacions = await importTransactions.execute(request.file.path);

    return response.json(transacions);
  },
);

export default transactionsRouter;
