﻿--
-- Script was generated by Devart dbForge Studio 2022 for MySQL, Version 9.1.100.0
-- Product home page: http://www.devart.com/dbforge/mysql/studio
-- Script date 3/13/2023 1:06:19 PM
-- Server version: 8.0.32
-- Client version: 4.1
--

-- 
-- Disable foreign keys
-- 
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

-- 
-- Set SQL mode
-- 
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 
-- Set character set the client will use to send SQL statements to the server
--
SET NAMES 'utf8';

DROP DATABASE IF EXISTS junior_internet_2023;

CREATE DATABASE junior_internet_2023
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

--
-- Set default database
--
USE junior_internet_2023;

--
-- Create table `family`
--
CREATE TABLE family (
  id int UNSIGNED NOT NULL AUTO_INCREMENT,
  name varchar(50) DEFAULT NULL,
  email varchar(50) NOT NULL,
  archive tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 19,
AVG_ROW_LENGTH = 5461,
CHARACTER SET utf8mb3,
COLLATE utf8mb3_general_ci;

--
-- Create table `user`
--
CREATE TABLE user (
  id int UNSIGNED NOT NULL AUTO_INCREMENT,
  family_id int UNSIGNED NOT NULL,
  login varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  role int UNSIGNED NOT NULL,
  balance int NOT NULL,
  first_name varchar(50) NOT NULL,
  last_name varchar(255) NOT NULL,
  archive tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 16,
AVG_ROW_LENGTH = 16384,
CHARACTER SET utf8mb3,
COLLATE utf8mb3_general_ci;

--
-- Create index `login` on table `user`
--
ALTER TABLE user
ADD UNIQUE INDEX login (login, family_id);

--
-- Create foreign key
--
ALTER TABLE user
ADD CONSTRAINT FK_user_family_id FOREIGN KEY (family_id)
REFERENCES family (id);

--
-- Create table `task_list`
--
CREATE TABLE task_list (
  id int UNSIGNED NOT NULL AUTO_INCREMENT,
  family_id int UNSIGNED NOT NULL,
  user_id int UNSIGNED NOT NULL,
  children_list json NOT NULL,
  title varchar(255) NOT NULL,
  description varchar(255) NOT NULL,
  reward int NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at date NOT NULL,
  archive tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 8,
CHARACTER SET utf8mb3,
COLLATE utf8mb3_general_ci;

--
-- Create foreign key
--
ALTER TABLE task_list
ADD CONSTRAINT FK_task_list_family_id FOREIGN KEY (family_id)
REFERENCES family (id);

--
-- Create foreign key
--
ALTER TABLE task_list
ADD CONSTRAINT FK_task_list_user_id FOREIGN KEY (user_id)
REFERENCES user (id);

--
-- Create table `expenses`
--
CREATE TABLE expenses (
  id int UNSIGNED NOT NULL AUTO_INCREMENT,
  child_id int UNSIGNED NOT NULL,
  category varchar(255) NOT NULL,
  amount float NOT NULL,
  created_at date NOT NULL,
  archive tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 6,
CHARACTER SET utf8mb3,
COLLATE utf8mb3_general_ci;

--
-- Create foreign key
--
ALTER TABLE expenses
ADD CONSTRAINT FK_expenses_child_id FOREIGN KEY (child_id)
REFERENCES user (id);

-- 
-- Restore previous SQL mode
-- 
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

-- 
-- Enable foreign keys
-- 
/*!40014 SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS */;