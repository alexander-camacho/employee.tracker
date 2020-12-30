const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employee_tracker_db"
});

const roles = []
const employees = []

connection.connect(function (err) {
    if (err) throw err;
    init()
});



function init() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add Department",
                "Add Role",
                "Add Employee",
                "View Departments",
                "View Roles",
                "View Employees",
                "Update Employee Role",
                "Exit"
            ]
        })
        .then((answer) => {
            switch (answer.action) {
                case "Add Department":
                    addDept();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "View Departments":
                    viewTable("department");
                    break;
                case "View Roles":
                    viewTable("role");
                    break;
                case "View Employees":
                    viewTable("employee");
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        })
}


function addDept() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "What is the name of the Department?"
        })
        .then((answer) => {
            console.log(answer.department)
            const query = connection.query(
                "INSERT INTO department (name) VALUES (?);",
                [answer.department],
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " department added!\n")

                })
            console.log(query.sql)
            init()
        })
}

function addRole() {
    inquirer
        .prompt([
            {
                name: "role",
                type: "input",
                message: "What is the name of the role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the starting salary for this role?",
            }
        ])
        .then((answer) => {
            const query = connection.query(
                "INSERT INTO role (title, salary) VALUES (?, ?);",
                [answer.role, answer.salary],
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " role added!\n")

                })
            console.table(query.sql)
            init()
        })
}

function addEmployee() {
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?",
            },
            {
                name: 'role',
                type: "list",
                choices: getRoles()
            },
            {
                name: 'manager',
                type: "list",
                choices: getEmployees()
            }
        ])
        .then((answer) => {
            console.log(answer)
            var userRole = getRoles().indexOf(answer.role) + 1
            var userManager = getEmployees().indexOf(answer.manager) + 1
            console.log(userRole)
            const query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);"
            connection.query(query, [answer.firstName, answer.lastName, userRole, userManager],
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " employee added!\n")

                })
            init()
        })
}

function viewTable(table) {
    const query = `SELECT * FROM ${table};`
    connection.query(query,
        function (err, res) {
            if (err) throw err;
            console.table(res)
            init()
        }
    )
}

function getRoles() {
    const query = "SELECT * FROM role;"
    connection.query(query, (err, res) => {
        if (err) throw err;
        res.forEach(role => {
            roles.push(role.title)
        });
    })
    return roles
}

function getEmployees() {
    const query = "SELECT * FROM employee;"
    connection.query(query, (err, res) => {
        if (err) throw err;
        res.forEach(employee => {
            employees.push(`${employee.first_name} ${employee.last_name}`)
        });
    })
    return employees
}

// SELECT first_name, last_name, title, salary
// FROM employee_tracker_db.employee
// INNER JOIN employee_tracker_db.role
// 	ON employee.role_id = role.id; 