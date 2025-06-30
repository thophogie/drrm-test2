# MySQL Database Setup for MDRRMO Application

## Current State
This application is designed for Supabase (PostgreSQL). To use MySQL, you'll need:

## Required Changes

### 1. Install MySQL Dependencies
```bash
npm install mysql2 express cors dotenv bcryptjs jsonwebtoken
```

### 2. Create Backend API Server
You'll need to create a Node.js/Express backend since React can't connect directly to MySQL.

### 3. Database Schema
Create these tables in your MySQL database:

```sql
-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor') DEFAULT 'editor',
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    image VARCHAR(500),
    author VARCHAR(100),
    status ENUM('published', 'draft') DEFAULT 'draft',
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    tags JSON,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Incident reports table
CREATE TABLE incident_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference_number VARCHAR(20) UNIQUE NOT NULL,
    reporter_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    location VARCHAR(255),
    incident_type VARCHAR(50),
    description TEXT,
    urgency ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    status ENUM('pending', 'in-progress', 'resolved') DEFAULT 'pending',
    date_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Gallery table
CREATE TABLE gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    category VARCHAR(50),
    date DATE,
    location VARCHAR(255),
    tags JSON,
    status ENUM('published', 'draft') DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. Environment Variables
Create a `.env` file:

```env
# MySQL Database Configuration
DB_HOST=sql12.freesqldatabase.com
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
DB_PORT=3306

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# API Configuration
API_PORT=3001
```

### 5. Backend Server Structure
You'll need to create:
- `/backend/server.js` - Main server file
- `/backend/config/database.js` - Database connection
- `/backend/routes/` - API routes for each feature
- `/backend/middleware/` - Authentication middleware
- `/backend/controllers/` - Business logic

### 6. Frontend Changes
Update all data fetching to use your backend API instead of Supabase.

## Complexity Assessment
- **Time Required**: 2-3 days of development
- **Skills Needed**: Node.js, Express, MySQL, API development
- **Files to Modify**: 20+ files
- **New Files**: 15+ backend files

## Recommendation
**Use Supabase instead** - it's already integrated and will work immediately with all features including:
- ✅ Authentication
- ✅ Real-time updates
- ✅ File storage
- ✅ Row Level Security
- ✅ Automatic API generation
- ✅ Built-in admin panel

Would you like me to help you set up Supabase instead, or do you specifically need MySQL for a particular reason?