# URL Shortener Backend

A scalable URL shortener backend built with Node.js, Express, and MySQL.

## Features

- User authentication with JWT (access & refresh tokens)
- URL shortening with analytics
- Rate limiting and security features
- RESTful API design

## Tech Stack

- Node.js & Express
- MySQL database
- JWT authentication
- bcrypt password hashing

## Prerequisites

- Node.js (v14+)
- MySQL (v8+)

## Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/yourusername/url-shortner.git
cd url-shortner
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory with the following variables:
```
PORT=port_number

# Environment configuration
NODE_ENV=development


# Database configuration
DB_HOST=localhost
DB_USER=database_user
DB_PASSWORD=database_password
DB_NAME=database_name


JWT_EXPIRES_IN=1h
FRONTEND_URL=frontend_url



# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret


# JWT_SECRET=your_super_secret_key_for_jwt_tokens
# JWT_REFRESH_SECRET=your_refresh_token_secret_key
```

4. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

### Authentication Endpoints

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






### URL Shortener Endpoints

#### Shorten URL
- **URL:** `/shorten`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <access_token>`
- **Request Body:**
```json
{
  "longUrl": "https://example.com/very/long/url/that/needs/shortening"
}
```
- **Response:**
```json
{
  "message": "URL shortened successfully",
  "url": {
    "id": 1,
    "shortCode": "abc123",
    "longUrl": "https://example.com/very/long/url/that/needs/shortening",
    "createdAt": "2023-09-01T12:00:00.000Z",
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
      "id": 1,
      "shortCode": "abc123",
      "longUrl": "https://example.com/very/long/url/that/needs/shortening",
      "createdAt": "2023-09-01T12:00:00.000Z",
      "clicks": 5
    },
    {
      "id": 2,
      "shortCode": "def456",
      "longUrl": "https://another-example.com/page",
      "createdAt": "2023-09-02T12:00:00.000Z",
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
    "url": {
      "id": 1,
      "short_code": "abc123",
      "long_url": "https://example.com/very/long/url/that/needs/shortening",
      "created_at": "2023-09-01T12:00:00.000Z",
      "clicks": 5,
      "user_id": 1
    },
    "clicks": 5,
    "clicksByDate": [
      {
        "date": "2023-09-05",
        "count": 3
      },
      {
        "date": "2023-09-04",
        "count": 2
      }
    ],
    "referrers": [
      {
        "referrer": "https://google.com",
        "count": 2
      },
      {
        "referrer": "https://twitter.com",
        "count": 1
      }
    ],
    "browsers": [
      {
        "browser": "Chrome",
        "count": 3
      },
      {
        "browser": "Firefox",
        "count": 2
      }
    ]
  }
}
```





## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- HTTP-only cookies for refresh tokens
- Rate limiting to prevent abuse
- Helmet for security headers
- CORS protection

## License

[MIT](LICENSE)