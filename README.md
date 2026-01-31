# AHA Bank - Basic Banking Application

A professional, secure, and fully functional banking application built with the MEN stack (MongoDB, Express, Node.js) and Vanilla JavaScript.

## 🚀 Live Demo
[Live Link (Render)] - https://aha-bank.onrender.com/

## ✨ Features

- **Authentication & Security**
  - Secure Register/Login/Logout.
  - JWT-based authentication with HTTP-only cookies.
  - Password hashing with Bcrypt.
- **Account Management**
  - Support for multiple accounts per user (Savings, Current, Fixed Deposit).
  - Unique account number generation.
- **Banking Operations**
  - Instant Deposit and Withdrawal.
  - Real-time Balance updates.
  - **Atomic Updates**: Uses MongoDB sessions to ensure balance safety and transaction integrity.
  - **Overdraft Protection**: Prevents withdrawals exceeding available balance.
- **Dashboard & UI**
  - Sleek, modern responsive design using Tailwind CSS.
  - Detailed transaction history for each account.
  - Loading states and error/success notifications.

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Frontend**: Vanilla HTML/JS, Tailwind CSS (via CDN)
- **Security**: JWT, BcryptJS, Cookie-Parser, Validator

## 📦 Project Structure

```bash
/banking-app
 ├── controllers/    # API Request Handlers
 ├── routes/         # Express Route Definitions
 ├── models/         # Mongoose Schemas
 ├── middlewares/    # Auth & Error Handlers
 ├── services/       # Core Business Logic (Atomic Operations)
 ├── public/         # Static Frontend Files (HTML/JS)
 ├── .env            # Environment Variables
 ├── app.js          # Express App Setup
 └── server.js       # Entry Point
```

## 🛠 Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd banking-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. **Run the application**:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

5. **Access the app**:
   Open `http://localhost:5000` in your browser.

## 📡 API Documentation

### Auth APIs
- `POST /api/auth/register` - Create a new user.
- `POST /api/auth/login` - Authenticate user and set cookie.
- `GET /api/auth/logout` - Clear authentication cookie.

### Account APIs
- `GET /api/accounts` - Get all accounts for the user.
- `POST /api/accounts/create` - Open a new account.
- `GET /api/accounts/:id` - Get specific account details.

### Transaction APIs
- `POST /api/transactions/deposit` - Deposit funds.
- `POST /api/transactions/withdraw` - Withdraw funds.
- `GET /api/transactions/:accountId` - Get transaction history.

## 🛡 Security & Best Practices
- **Atomic Transactions**: Withdrawal and account balance updates are wrapped in MongoDB transactions to ensure they succeed or fail together.
- **Input Sanitization**: All inputs are validated to prevent malicious data.
- **JWT Storage**: Tokens are stored in HTTP-only cookies to mitigate XSS attacks.
