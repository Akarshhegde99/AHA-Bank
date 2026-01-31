const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    accountType: {
        type: String,
        enum: ['Savings', 'Current', 'Fixed Deposit'],
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        min: [0, 'Balance cannot be negative']
    },
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;
