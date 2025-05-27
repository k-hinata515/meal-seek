CREATE DATABASE IF NOT EXISTS meal_seek_db;
USE meal_seek_db;

CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE favorite_shops (
    favorite_shops_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    shops_id VARCHAR(255) NOT NULL,
    shops_name VARCHAR(255) NULL,
    shops_thumb_img VARCHAR(255) NULL,
    note TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE (shops_id , user_id)
);

CREATE TABLE tags (
    tags_id VARCHAR(255) PRIMARY KEY,
    tags_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (tags_name)
);

CREATE TABLE favorite_tags (
    favorite_shops_id VARCHAR(255) NOT NULL,
    tags_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (favorite_shops_id, tags_id),
    FOREIGN KEY (favorite_shops_id) REFERENCES favorite_shops(favorite_shops_id) ON DELETE CASCADE,
    FOREIGN KEY (tags_id) REFERENCES tags(tags_id) ON DELETE CASCADE
);

CREATE TABLE sessions (
    sessions_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NULL,
    data JSON NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);