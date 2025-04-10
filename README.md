# URL Shortener Backend

A scalable URL shortener backend built with **Node.js**, **Express**, and **MySQL**.

## 🚀 Features

- 🔐 **User Authentication** – JWT-based authentication with access & refresh tokens.
- 🔗 **URL Shortening** – Convert long URLs into short, shareable links.
- **Analytics** – Track clicks, referrers, and browser usage.
-  **Rate Limiting** – Prevent abuse with request rate limiting.
-  **Security Features** – Includes password hashing, CORS protection, and security headers.
-  **RESTful API** – Designed for seamless integration with frontend applications

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens), bcrypt for password hashing
- **Security:** Helmet, CORS, rate limiting

## 📌 Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+)
- [MySQL](https://www.mysql.com/) (v8+)

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/url-shortner.git
cd url-shortner
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```ini
PORT=3000
NODE_ENV=development



# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=url_shortener_db

# JWT Secrets
JWT_SECRET=your_super_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret_key
JWT_EXPIRES_IN=1h

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 4️⃣ Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📚 API Documentation

### 🔑 Authentication Endpoints

#### User Registration
- **URL:** `/auth/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "accessToken": "jwt_access_token",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```




#### User Login
- **URL:** `/auth/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "accessToken": "jwt_access_token",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```

#### User Logout
- **URL:** `/auth/logout`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <access_token>`
- **Response:**
  ```json
  {
    "message": "Logout successful"
  }
  ```

### 🔗 URL Shortener Endpoints

#### Shorten URL
- **URL:** `/shorten`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <access_token>`
- **Request Body:**
  ```json
  {
    "longUrl": "https://example.com/very/long/url"
  }
  ```
- **Response:**
  ```json
  {
    "message": "URL shortened successfully",
    "url": {
      "shortCode": "abc123",
      "longUrl": "https://example.com/very/long/url",
      "clicks": 0
    }
  }
  ```

#### Get User URLs
- **URL:** `/urls`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <access_token>`
- **Response:**
  ```json
  {
    "urls": [
      {
        "shortCode": "abc123",
        "longUrl": "https://example.com/page1",
        "clicks": 5
      },
      {
        "shortCode": "def456",
        "longUrl": "https://example.com/page2",
        "clicks": 3
      }
    ]
  }
  ```

#### Get URL Analytics
- **URL:** `/analytics/:shortUrl`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <access_token>`
- **Response:**
  ```json
  {
    "analytics": {
      "shortCode": "abc123",
      "clicks": 5,
      "referrers": [
        { "source": "https://google.com", "count": 2 },
        { "source": "https://twitter.com", "count": 1 }
      ],
      "browsers": [
        { "browser": "Chrome", "count": 3 },
        { "browser": "Firefox", "count": 2 }
      ]
    }
  }
  ```



## 🔒 Security Considerations

- 🔑 **Password Hashing:** bcrypt ensures user passwords are stored securely.
- 🔐 **JWT Tokens:** Secure authentication with short-lived access tokens and refresh tokens.
- **HTTP-Only Cookies:** Used for refresh token storage to enhance security.
-  **Rate Limiting:** Protects against excessive API requests.
-  **Helmet Middleware:** Adds security headers to prevent common vulnerabilities.
-  **CORS Protection:** Restricts API access to allowed domains.

##  License

This project is licensed under the [MIT License](LICENSE).
