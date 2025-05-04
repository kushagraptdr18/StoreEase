# 🛍️ StoreEase

*StoreEase* is a comprehensive, user-friendly, and real-time store management system built with the *MERN stack (MongoDB, Express.js, React, Node.js)*. Designed for small to medium-sized shopkeepers, it streamlines daily operations like sales tracking, billing, inventory updates, and customer management — all in one place.

Whether you're running a grocery shop, retail store, or local market outlet, StoreEase helps automate routine tasks, reduce manual errors, and improve business visibility through intuitive dashboards and real-time reporting.

## 🚀 Features

### 🧾 Billing and Sales Management
- Create, edit, and track customer bills dynamically.
- Automatic stock update when items are added to a bill.
- Real-time calculation of total bill amount and taxes.

### 📦 Inventory Management
- Add, update, or remove products with real-time stock tracking.
- View and manage current inventory levels directly from the dashboard.

### 📊 Daily Sales Dashboard
- Displays total sales for the current day.
- Lists all customers who made purchases with amount and payment mode.
- Quick insights for business owners on daily performance.

### 👤 Customer & Profile Management
- Maintain individual customer billing records.
- View history of transactions associated with each customer.

### 🔐 Authentication & Authorization
- Secure login/signup with JWT-based authentication.
- Role-based access control (admin, shopkeeper, etc.)

### 💬 Real-time Features (Upcoming or Extensible via Socket.IO)
- Real-time updates when a bill is created or product is purchased.
- Alerts for low-stock products or high-value transactions.

### 📱 Modern, Responsive UI
- Mobile-friendly design built with React and Bootstrap.
- Clean user interface for quick navigation and usability.

---
## Technologies Used
Frontend: React, Redux, Axios, Bootstrap

Backend: Node.js, Express, MongoDB, Mongoose, JSON Web Tokens (JWT)

Others: dotenv for environment variable management

## 📁 Project Structure
StoreEase/
├── ShopKeeperBackend-main/   # Backend source code

└── ShopKeeperFrontend-main/  # Frontend source code

## Installation
## 1. Clone the Repository
   git clone https://github.com/Ishitame/StoreEase.git
   
   cd StoreEase
##  2. Install Backend Dependencies
    cd ShopKeeperBackend-main
    npm install
## 3. Install Frontend Dependencies
    cd ../ShopKeeperFrontend-main
    npm install

## Running the Application
## 1. Start the Backend Server
   cd ../ShopKeeperBackend-main
   
   npx nodemon
   
   By default, the backend server runs on http://localhost:5000.

## 2. Start the Frontend Development Server
   cd ../ShopKeeperFrontend-main
   
   npm run dev

## Environment Configuration
## Backend (ShopKeeperBackend-main)
Create a .env file in the ShopKeeperBackend-main directory with the following variables:

PORT: Port number on which the backend server will run.

MONGO_URI: MongoDB connection string.

JWT_SECRET: Secret key for JSON Web Token authentication.
