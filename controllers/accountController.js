const Account = require('../models/Account');
const { generateAccountNumber } = require('../utils/accountUtils');

exports.createAccount = async (req, res) => {
    try {
        const { accountType } = req.body;

        // Check if user already has an account of this type
        const existingAccount = await Account.findOne({
            userId: req.user._id,
            accountType
        });

        if (existingAccount) {
            return res.status(400).json({
                status: 'fail',
                message: `You already have a ${accountType} account.`
            });
        }

        const newAccount = await Account.create({
            userId: req.user._id,
            accountType,
            accountNumber: generateAccountNumber(),
            balance: 0
        });

        res.status(201).json({
            status: 'success',
            data: {
                account: newAccount
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ userId: req.user._id });

        res.status(200).json({
            status: 'success',
            results: accounts.length,
            data: {
                accounts
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getAccount = async (req, res) => {
    try {
        const account = await Account.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                status: 'fail',
                message: 'Account not found or access denied'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                account
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
