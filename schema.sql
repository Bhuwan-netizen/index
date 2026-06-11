-- SQL Schema Setup
CREATE DATABASE IF NOT EXISTS employee_ledger;
USE employee_ledger;

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20),
    hourly_rate DECIMAL(10, 2) DEFAULT 15.00
);

CREATE TABLE IF NOT EXISTS shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    shift_name VARCHAR(50),
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    date DATE NOT NULL,
    status VARCHAR(20), -- 'Present', 'Absent'
    hours_worked DECIMAL(5, 2) DEFAULT 0.00,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payroll (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    allowances DECIMAL(10, 2) DEFAULT 0.00,
    total_pay DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);
