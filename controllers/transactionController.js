const bankingService = require('../services/bankingService');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

exports.deposit = async (req, res) => {
    try {
        const { accountId, amount, description } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ status: 'fail', message: 'Invalid amount' });
        }

        const result = await bankingService.deposit(accountId, parseFloat(amount), description, req.user._id);

        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.withdraw = async (req, res) => {
    try {
        const { accountId, amount, description } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ status: 'fail', message: 'Invalid amount' });
        }

        const result = await bankingService.withdraw(accountId, parseFloat(amount), description, req.user._id);

        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getTransactionHistory = async (req, res) => {
    try {
        const { accountId } = req.params;

        // Verify account belongs to user
        const account = await Account.findOne({ _id: accountId, userId: req.user._id });
        if (!account) {
            return res.status(404).json({
                status: 'fail',
                message: 'Account not found or access denied'
            });
        }

        const transactions = await Transaction.find({ accountId }).sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: transactions.length,
            data: {
                transactions
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
