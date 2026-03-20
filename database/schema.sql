-- ============================================================
-- NEON TECH – Database Schema
-- Run this file ONCE to create all tables
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS neon_tech_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE neon_tech_db;

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Users (
  id            INT           AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  lang          ENUM('en','ar')          NOT NULL DEFAULT 'en',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Products ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Products (
  id          INT            AUTO_INCREMENT PRIMARY KEY,
  name_en     VARCHAR(200)   NOT NULL,
  name_ar     VARCHAR(200)   NOT NULL,
  desc_en     TEXT           NOT NULL,
  desc_ar     TEXT           NOT NULL,
  category    VARCHAR(100)   NOT NULL,
  price       DECIMAL(10,2)  NOT NULL,
  image_path  VARCHAR(300)   NOT NULL,
  stock       INT            NOT NULL DEFAULT 50,
  rating      DECIMAL(3,2)   NOT NULL DEFAULT 0.00,
  created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Shopping Cart ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ShopCart (
  id          INT  AUTO_INCREMENT PRIMARY KEY,
  user_id     INT  NOT NULL,
  product_id  INT  NOT NULL,
  quantity    INT  NOT NULL DEFAULT 1,
  added_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES Users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, product_id)
) ENGINE=InnoDB;

-- ── Orders ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Orders (
  id                INT            AUTO_INCREMENT PRIMARY KEY,
  user_id           INT            NOT NULL,
  total             DECIMAL(10,2)  NOT NULL,
  status            ENUM('pending','paid','processing','shipped','delivered','cancelled')
                    NOT NULL DEFAULT 'pending',
  stripe_session_id VARCHAR(255)   NULL,
  shipping_name     VARCHAR(150)   NULL,
  shipping_address  VARCHAR(300)   NULL,
  shipping_city     VARCHAR(100)   NULL,
  shipping_country  VARCHAR(100)   NULL,
  created_at        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Order Items ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS OrderItems (
  id          INT           AUTO_INCREMENT PRIMARY KEY,
  order_id    INT           NOT NULL,
  product_id  INT           NOT NULL,
  quantity    INT           NOT NULL,
  unit_price  DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES Orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ── Wishlist ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Wishlist (
  id          INT  AUTO_INCREMENT PRIMARY KEY,
  user_id     INT  NOT NULL,
  product_id  INT  NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES Users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist_item (user_id, product_id)
) ENGINE=InnoDB;

-- ── Reviews ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Reviews (
  id          INT   AUTO_INCREMENT PRIMARY KEY,
  user_id     INT   NOT NULL,
  product_id  INT   NOT NULL,
  rating      TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT  NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES Users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_review (user_id, product_id)
) ENGINE=InnoDB;

-- ── Update product rating via trigger ────────────────────────
DELIMITER $$

CREATE TRIGGER IF NOT EXISTS trg_update_rating_insert
AFTER INSERT ON Reviews
FOR EACH ROW
BEGIN
  UPDATE Products
  SET rating = (SELECT AVG(rating) FROM Reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
END$$

CREATE TRIGGER IF NOT EXISTS trg_update_rating_update
AFTER UPDATE ON Reviews
FOR EACH ROW
BEGIN
  UPDATE Products
  SET rating = (SELECT AVG(rating) FROM Reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
END$$

CREATE TRIGGER IF NOT EXISTS trg_update_rating_delete
AFTER DELETE ON Reviews
FOR EACH ROW
BEGIN
  UPDATE Products
  SET rating = IFNULL((SELECT AVG(rating) FROM Reviews WHERE product_id = OLD.product_id), 0)
  WHERE id = OLD.product_id;
END$$

DELIMITER ;
