const express = require('express');
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware.protect);

router.post('/create', accountController.createAccount);
router.get('/', accountController.getAllAccounts);
router.get('/:id', accountController.getAccount);

module.exports = router;
