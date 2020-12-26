const mysql = require("mysql");
const inquirer = require("inquirer");

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

connection.connect(function (err) {
    if (err) throw err;
    init()
});


function init() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Add Department",
                "Add Role",
                "Add Employee",
                "View Departments",
                "View Roles",
                "View Employees",
                "Update Employee Role"
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
                "INSERT INTO department (name) VALUES (?)",
                [answer.department],
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " department added!\n")

                })
            console.log(query.sql)
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
            console.log(answer)
            const query = connection.query(
                "INSERT INTO role (title, salary) VALUES (?, ?)",
                [answer.role, answer.salary],
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " role added!\n")

                })
            console.log(query.sql)
        })
}