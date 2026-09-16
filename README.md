# UPI Payment Backend

A backend system for a UPI-style digital payment application built with Node.js, Express.js, and MongoDB. The project implements user authentication, JWT-based authorization, wallet management, UPI-style money transfers, MPIN verification, bill payments, and transaction history.

## 🚀 Features

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Password Hashing using bcrypt
- MPIN Setup and Verification
- Automatic UPI ID Generation
- Wallet Balance Management
- Add Money to Wallet
- Send Money using Phone Number or UPI ID
- Bill Payment
- Transaction History
- MongoDB Database Integration
- Swagger API Documentation
- CORS Support
- Environment Variable Configuration

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Token (JWT)
- bcrypt

### API Documentation
- Swagger UI
- Swagger 2.0

### Development Tools
- Nodemon
- Postman
- Git & GitHub

## 📁 Project Structure

## Project Structure

```
Upi_Backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── txnController.js
│   │   └── walletController.js
│   │
│   ├── middleware/
│   │   └── protect.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   │
│   └── routes/
│       ├── authRoutes.js
│       ├── transactionRoutes.js
│       └── walletRoutes.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── swagger-output.json
```


⚙️ Installation
1. Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL
2. Navigate to the project
cd Upi_Backend
3. Install dependencies
npm install
4. Configure environment variables

Create a .env file in the root directory.

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Do not commit your .env file to GitHub.

5. Start the development server
npm run dev

The server will run on:

http://localhost:3000
📚 API Documentation

Swagger documentation is available at:

http://localhost:3000/api-docs

The API includes documentation for authentication, wallet operations, money transfers, bill payments, and transaction history.

🔐 Authentication

The project uses JWT-based authentication.

After registration or login, the API returns a JWT token.

For protected endpoints, send the token using the Authorization header:

Authorization: Bearer <your_token>

Protected operations include:

Set MPIN
Get Profile
Add Money
Send Money
Transaction History
Pay Bill
🔄 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user
POST	/api/auth/set-mpin	Set 4-digit MPIN
GET	/api/auth/profile	Get authenticated user profile
Wallet
Method	Endpoint	Description
POST	/api/wallet/add-money	Add money to wallet
POST	/api/wallet/pay-bill	Pay a utility bill
Transactions
Method	Endpoint	Description
POST	/api/transactions/send	Send money to another user
GET	/api/transactions/history	Get transaction history
💳 Payment Flow

The basic payment flow is:

User Registration
       ↓
User Login
       ↓
JWT Token Generated
       ↓
Set MPIN
       ↓
Add Money
       ↓
Send Money / Pay Bill
       ↓
Transaction Created
       ↓
Transaction History
🔑 UPI ID Generation

During registration, a UPI-style ID is automatically generated from the user's email address.

Example:

Email:
avi12@gmail.com

Generated UPI ID:
avi12@youpe
🗄️ Database Models
User

The User model stores:

Name
Email
Phone Number
Password
UPI ID
Wallet Balance
MPIN
Created/Updated timestamps
Transaction

The Transaction model stores:

Sender
Receiver
Transaction Type
Amount
Biller Name
Transaction Status
Created/Updated timestamps

Supported transaction types:

TRANSFER
ADD_MONEY
WITHDRAWAL
BILL_PAYMENT

Supported transaction statuses:

SUCCESS
FAILED
PENDING
🧪 Testing

The APIs can be tested using:

Postman
Swagger UI

Recommended testing flow:

1. Register User
2. Login
3. Set MPIN
4. Get Profile
5. Add Money
6. Register another User
7. Send Money
8. Check Transaction History
9. Pay Bill
🔒 Security

The project implements:

Password hashing using bcrypt
Hashed MPIN storage
JWT-based authentication
Protected API routes
Environment variables for sensitive configuration
Password and MPIN excluded from profile response
🚧 Future Improvements

The current project is a backend implementation for learning and portfolio purposes. Possible production-level improvements include:

MongoDB transactions for atomic money transfers
Better concurrency handling for wallet balances
Idempotency for payment requests
Payment transaction locking
Rate limiting
Input validation using a validation library
Refresh token mechanism
Role-based authorization
Redis caching
Payment gateway integration
Docker containerization
CI/CD pipeline
Logging and monitoring
Automated unit and integration testing
⚠️ Disclaimer

This project is an educational implementation of a UPI-style payment backend. It is not connected to real banking or UPI infrastructure and should not be used to process real financial transactions.

👨‍💻 Author

Aviral Joshi

B.Tech Computer Science & Engineering

Birla Institute of Applied Sciences, Bhimtal
