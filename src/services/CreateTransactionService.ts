import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';

import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
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
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    let transactionCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    const balance = await transactionRepository.getBalance();

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    if (balance.total < value && type === 'outcome') {
      throw new AppError('Você Não tem saldo para esta operração', 400);
    }

    const transaction = transactionRepository.create({
      category: transactionCategory,
      title,
      value,
      type,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
