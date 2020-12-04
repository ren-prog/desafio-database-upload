import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    // TODO
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    // Verificar se a categoria existe

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome') {
      if (value > total) {
        throw new AppError('Outcome value cannot be greater than the Total');
      }
    }

    let categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      categoryExists = await categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryExists);
    }

    console.log(categoryExists);
    const transaction = await transactionRepository.create({
      title,
      value,
      type,
      category: categoryExists,
    });

    await transactionRepository.save(transaction);

    return transaction;

    // Incluir a transaction
  }
}

export default CreateTransactionService;
