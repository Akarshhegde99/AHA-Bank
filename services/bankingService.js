const mongoose = require('mongoose');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.deposit = async (accountId, amount, description, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const account = await Account.findOne({ _id: accountId, userId }).session(session);
        if (!account) throw new Error('Account not found or access denied');
        if (account.status === 'closed') throw new Error('Account is closed');

        account.balance += amount;
        await account.save({ session });

        const transaction = await Transaction.create([{
            accountId,
            type: 'deposit',
            amount,
            description
        }], { session });

        await session.commitTransaction();
        session.endSession();
        return { account, transaction: transaction[0] };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

exports.withdraw = async (accountId, amount, description, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const account = await Account.findOne({ _id: accountId, userId }).session(session);
        if (!account) throw new Error('Account not found or access denied');
        if (account.status === 'closed') throw new Error('Account is closed');
        if (account.balance < amount) throw new Error('Insufficient balance');

        account.balance -= amount;
        await account.save({ session });

        const transaction = await Transaction.create([{
            accountId,
            type: 'withdrawal',
            amount,
            description
        }], { session });

        await session.commitTransaction();
        session.endSession();
        return { account, transaction: transaction[0] };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
