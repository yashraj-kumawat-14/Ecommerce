# E-commerce Website

A simple yet fully functional e-commerce website built using Node.js. This project includes user registration with email verification, product search, detailed product view, order checkout, payment integration via Razorpay, and password recovery with email code verification.

## Features

- **User Registration and Login**
  - Register with email verification using Nodemailer.
  - Login with registered credentials.
  
- **Product Search and Details**
  - Search for products using the search bar.
  - View detailed information for each product.

- **Order and Payment**
  - Checkout any order.
  - Make secure payments via Razorpay.

- **Password Recovery**
  - Reset password using email code verification.

## Installation

### Prerequisites

- Node.js and npm installed on your machine.
- A Razorpay account for payment gateway integration.
- A Gmail account for Nodemailer configuration.

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `config.json` file in the project root and add the following object:
   ```env
   {PORT:5502,
   RAZORPAY_KEY_ID:<your-razorpay-key-id>,
   RAZORPAY_KEY_SECRET:<your-razorpay-key-secret>,
   EMAIL_SERVICE:gmail,
   EMAIL_USER:<your-email>,
   EMAIL_PASS:<your-email-app-password>
   }
   ```

4. **Run the application**
   ```bash
   npm start
   ```

5. **Access the application**
   Open your browser and go to `http://localhost:5502`.


## Usage

- **Register a new account** using your email and verify it via the verification email.
- **Search for products** in the search bar.
- **View product details** by clicking on any product.
- **Buy product securely with Razorpay**
- **Reset your password** if forgotten, using email code verification.

## Dependencies

- **Node.js**
- **Nodemailer** (Email service)
- **Razorpay Node.js SDK**

## Contributions
Contributions are welcome! Feel free to fork this repository and submit a pull request.

