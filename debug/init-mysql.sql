CREATE DATABASE IF NOT EXISTS junior_internet_2023;

CREATE TABLE junior_internet_2023.users (
	id varchar(36) PRIMARY KEY,
	family_id varchar(36),
	role INT,
	email varchar(100) NOT NULL,
	password varchar(64),
	first_name varchar(30),
	last_name varchar(30),
	UNIQUE KEY(email)
);