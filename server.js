const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database connection (Creates 'database.db' file automatically)
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
    if (err) {
        console.error('SQLite database connection failed: ' + err.message);
    } else {
        console.log('Connected to self-contained SQLite database. 🚀');
        createTables();
    }
});

// Setup tables automatically if they don't exist (Fixed SQLite Syntax)
function createTables() {
    db.serialize(() => {
        // In SQLite, INTEGER PRIMARY KEY automatically auto-increments. 
        // Removing 'AUTO_INCREMENT' prevents syntax errors.
        db.run(`CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT,
            phone TEXT,
            hourly_rate REAL DEFAULT 15.00
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS shifts (
            id INTEGER PRIMARY KEY,
            employee_id INTEGER,
            shift_name TEXT,
            start_time TEXT,
            end_time TEXT,
            FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY,
            employee_id INTEGER,
            date TEXT NOT NULL,
            status TEXT,
            hours_worked REAL DEFAULT 0.00,
            FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
        )`);
    });
}

// --- API ROUTES ---

// 1. Employees API
app.get('/api/employees', (req, res) => {
    db.all('SELECT * FROM employees', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
// DELETE an employee (and cascading records)
app.delete('/api/employees/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM employees WHERE id = ?';
    
    db.run(sql, id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Employee and all associated records deleted successfully' });
    });
});



app.post('/api/employees', (req, res) => {
    const { name, address, phone, hourly_rate } = req.body;
    const sql = 'INSERT INTO employees (name, address, phone, hourly_rate) VALUES (?, ?, ?, ?)';
    db.run(sql, [name, address, phone, hourly_rate], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name, address, phone, hourly_rate });
    });
});

// 2. Shifts API
app.get('/api/shifts', (req, res) => {
    const query = `
        SELECT shifts.*, employees.name FROM shifts 
        JOIN employees ON shifts.employee_id = employees.id`;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/shifts', (req, res) => {
    const { employee_id, shift_name, start_time, end_time } = req.body;
    const sql = 'INSERT INTO shifts (employee_id, shift_name, start_time, end_time) VALUES (?, ?, ?, ?)';
    db.run(sql, [employee_id, shift_name, start_time, end_time], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Shift assigned successfully' });
    });
});

// 3. Attendance API
app.get('/api/attendance', (req, res) => {
    const query = `
        SELECT attendance.*, employees.name FROM attendance 
        JOIN employees ON attendance.employee_id = employees.id`;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/attendance', (req, res) => {
    const { employee_id, date, status, hours_worked } = req.body;
    const sql = 'INSERT INTO attendance (employee_id, date, status, hours_worked) VALUES (?, ?, ?, ?)';
    db.run(sql, [employee_id, date, status, hours_worked], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Attendance recorded' });
    });
});

// 4. Payroll API
app.get('/api/payroll', (req, res) => {
    const query = `
        SELECT employees.id, employees.name, employees.hourly_rate,
        COALESCE(SUM(attendance.hours_worked), 0) as total_hours,
        COALESCE(SUM(attendance.hours_worked * employees.hourly_rate), 0) as earnings
        FROM employees
        LEFT JOIN attendance ON employees.id = attendance.employee_id AND attendance.status = 'Present'
        GROUP BY employees.id`;
    
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// DELETE an employee (Place this above app.listen)
app.delete('/api/employees/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM employees WHERE id = ?';
    
    db.run(sql, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Employee and all associated records deleted successfully' });
    });
});


// Start Server
app.listen(3000, () => {
    console.log('Server running smoothly on http://localhost:3000');
});