# MySQL Database Setup Guide

## Overview

This application now supports both **Supabase (PostgreSQL)** and **MySQL** databases. You can switch between them using the Database Selector in the admin panel.

## Option 1: Quick Setup with Free MySQL Hosting

### 1. Get Free MySQL Database
- **FreeSQLDatabase**: https://www.freesqldatabase.com/
- **db4free**: https://www.db4free.net/
- **RemoteMySQL**: https://remotemysql.com/

### 2. Create Database
1. Sign up for a free account
2. Create a new database
3. Note down your credentials:
   - Host
   - Username  
   - Password
   - Database name
   - Port (usually 3306)

### 3. Run Schema Script
1. Access your database via phpMyAdmin or MySQL client
2. Copy and paste the content from `src/sql/mysql-schema.sql`
3. Execute the script to create tables and sample data

## Option 2: Local MySQL Setup

### 1. Install MySQL
```bash
# Windows: Download from https://dev.mysql.com/downloads/mysql/
# macOS: 
brew install mysql

# Ubuntu/Debian:
sudo apt update
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql
```

### 2. Create Database
```sql
mysql -u root -p
CREATE DATABASE mdrrmo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mdrrmo_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON mdrrmo_db.* TO 'mdrrmo_user'@'localhost';
FLUSH PRIVILEGES;
USE mdrrmo_db;
```

### 3. Import Schema
```bash
mysql -u mdrrmo_user -p mdrrmo_db < src/sql/mysql-schema.sql
```

## Switching Between Databases

### In Admin Panel:
1. Go to admin panel (bottom left sidebar)
2. Click the database settings icon next to the database status
3. Select your preferred database type
4. For MySQL, enter your connection details:
   - Host: `your-mysql-host.com`
   - Username: `your_username`
   - Password: `your_password`
   - Database: `your_database_name`
   - Port: `3306` (default)
5. Click "Connect"

### Environment Variables (Optional):
You can also set default MySQL credentials in `.env`:
```env
# Supabase (current)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# MySQL (optional)
MYSQL_HOST=your_mysql_host
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=your_mysql_database
MYSQL_PORT=3306
```

## Database Comparison

| Feature | Supabase | MySQL |
|---------|----------|-------|
| **Setup** | ✅ Already configured | ⚙️ Requires setup |
| **Real-time** | ✅ Built-in | ❌ Not available |
| **Authentication** | ✅ Built-in | ❌ Custom required |
| **File Storage** | ✅ Built-in | ❌ External needed |
| **Admin Panel** | ✅ Built-in | ❌ External needed |
| **Hosting** | ✅ Cloud-hosted | ⚙️ Self-hosted |
| **Cost** | 💰 Free tier available | 💰 Hosting costs |

## Troubleshooting

### Connection Issues:
1. **Check credentials** - Verify host, username, password, database name
2. **Firewall** - Ensure MySQL port (3306) is accessible
3. **SSL** - Some hosts require SSL connections
4. **Privileges** - User must have SELECT, INSERT, UPDATE, DELETE permissions

### Common Errors:
- `ER_ACCESS_DENIED_ERROR` - Wrong username/password
- `ECONNREFUSED` - Wrong host/port or MySQL not running
- `ER_BAD_DB_ERROR` - Database doesn't exist
- `ER_NO_SUCH_TABLE` - Schema not imported

### Performance Tips:
1. **Indexes** - Add indexes on frequently queried columns
2. **Connection Pooling** - Already configured (max 10 connections)
3. **Query Optimization** - Use EXPLAIN to analyze slow queries

## Migration from Supabase to MySQL

If you want to migrate existing data:

1. **Export from Supabase**:
   ```sql
   -- In Supabase SQL Editor
   COPY (SELECT * FROM news) TO STDOUT WITH CSV HEADER;
   ```

2. **Import to MySQL**:
   ```sql
   LOAD DATA INFILE 'news.csv' 
   INTO TABLE news 
   FIELDS TERMINATED BY ',' 
   ENCLOSED BY '"' 
   LINES TERMINATED BY '\n' 
   IGNORE 1 ROWS;
   ```

## Recommendation

**For production use, we recommend staying with Supabase** because:
- ✅ Zero configuration required
- ✅ Built-in authentication & security
- ✅ Real-time features
- ✅ Automatic backups
- ✅ Scalable infrastructure
- ✅ Built-in admin tools

**Use MySQL if you need**:
- Full control over database
- Existing MySQL infrastructure
- Specific compliance requirements
- Custom database optimizations

The application will work seamlessly with both options! 🚀