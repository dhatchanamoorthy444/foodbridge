-- FoodBridge local demo user table (MySQL 8 / MariaDB)
-- Run this only if you want to create the table manually. The backend also
-- creates it automatically on first start when MySQL is reachable.

CREATE DATABASE IF NOT EXISTS foodbridge
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE foodbridge;

CREATE TABLE IF NOT EXISTS demo_users (
  id            VARCHAR(64)  PRIMARY KEY,
  username      VARCHAR(64)  NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(255) NOT NULL,
  role          VARCHAR(32)  NOT NULL DEFAULT 'donor',
  organization  VARCHAR(255),
  phone         VARCHAR(64),
  city          VARCHAR(128),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Demo account: username `user`, password `user`
-- (bcrypt hash of "user" — change both the hash and the app config if you
--  want different presentation credentials.)
INSERT IGNORE INTO demo_users
  (id, username, email, password_hash, full_name, role, organization, phone, city)
VALUES
  (
    'demo-user-0001',
    'user',
    'user@foodbridge.local',
    '$2a$10$jlDuQaJgVaKynpjlF9kTuOLjOStstUAE5ufxRzpLuqrmrXRwUwF1e',
    'Demo Operator',
    'donor',
    'FoodBridge Demo Kitchen',
    '+91 90000 00000',
    'Chennai'
  );

SELECT id, username, email, role, organization, created_at FROM demo_users;
