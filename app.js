// Dependencies

const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

// Connection to mysql database
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


// Start the connection and run the init function.
connection.connect(function (err) {
    if (err) throw err;
    init()
});


// Starts an inquirer prompt that gives the user a list of items to choose from.
function init() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Employees By Department",
                "View Roles By Department",
                "View Departments",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Exit"
            ]
        })

        // Determine which function to use based on the user's answer.
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
                case "View Employees By Department":
                    viewEmployees();
                    break;
                case "View Departments":
                    viewDepartments();
                    break;
                case "View Roles By Department":
                    viewRoles();
                    break;
                case "Update Employee Role":
                    updateRole();
                // If Exit is select the program will close.
                case "Exit":
                    connection.end();
                    break;
            }
        })
}

// Function to create new departments.
function addDept() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "What is the name of the Department?"
        })
        .then((answer) => {
            // console.log(answer.department)
            // Place the users answer into the query and run the query.
            const query = connection.query(
                "INSERT INTO department (department) VALUES (?);",
                [answer.department],
                function (err, res) {
                    if (err) throw err;
                    // Display a success statement.
                    console.log(res.affectedRows + " department added!\n")

                })
            // Run the init function again.
            console.log(query.sql)
            init()
        })
}

// Function to add new roles.
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
            },
            {
                name: "department",
                type: "list",
                message: "Which department is this role from?",
                choices: getDepartments()
            }

        ])
        .then((answer) => {
            
            // Assign the new roles deptId to the index of the role that was chosen as the table requires an int value. 1 is also added as the first value in the table is 1 rather than 0 in an array.
            var deptId = getDepartments().indexOf(answer.department) + 1
            // Place the users answers into the query below.
            const query = connection.query(
                "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);",
                [answer.role, answer.salary, deptId],
                function (err, res) {
                    if (err) throw err;
                    // Display a success message.
                    console.log(res.affectedRows + " role added!\n")

                })
            // Run the init function again.
            console.table(query.sql)
            init()
        })
}

// Function to add a new employee.
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
                message: "What is the employee's role?",
                // The choices array is generated by running the getRoles() function
                choices: getRoles()
            },
            {
                name: 'manager',
                type: "list",
                message: "Who is the employee's manager?",
                // The choices array is generated by running the getEmployees() function
                choices: getEmployees()
            }
        ])
        .then((answer) => {
            console.log(answer)

            // Assign the new employee's roleId to the index of the role that was chosen as the table requires an int value. 1 is also added as the first value in the table is 1 rather than 0 in an array.
            var roleId = getRoles().indexOf(answer.role) + 1

            // Assign the new employee's managerId to the index of the manager that was chosen as the table requires an int value.
            var managerId = getEmployees().indexOf(answer.manager)

            // Insert the user's answers into the query below.
            const query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);"
            connection.query(query, [answer.firstName, answer.lastName, roleId, managerId],
                function (err, res) {
                    if (err) throw err;
                    // Display a success message.
                    console.log(res.affectedRows + " employee added!\n")

                })
            // Run the init function again.
            init()
        })
}

// Function to view all employees in the console.
function viewEmployees() {
    // A select query that will display information about the employees based on information from the 3 associated tables.
    // First determine the columns that are needed (employee.first_name, employee.last_name, title, salary, department,
    const query = "SELECT concat(employee.first_name,' ', employee.last_name) AS name, title, salary, department, concat(manager.first_name, ' ', manager.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee manager on employee.manager_id = manager.id ORDER BY department,name ASC;"

    connection.query(query, (err, res) => {
        if (err) throw err;
        // Display the results in a console.table(), then run the init() function again.
        console.table(res)
        init()
    })
}
// Array that will hold the title of all roles.
var roles = []

// Function to return the list of all roles.
function getRoles() {

    // Query all of the data from the role table. 
    const query = "SELECT * FROM role;"
    connection.query(query, (err, res) => {
        if (err) throw err;
        // For each row in the table push only the title into the roles array.
        res.forEach(role => {
            roles.push(role.title)
        });
    })
    // Return the roles array.
    return roles
}
// Array that will hold the names of all employees.
// None is included as a choice for employees with no direct manager.
var employees = ['None']

// Function to return the list of all employees.
function getEmployees() {

    // Query all of the data from the employee table.
    const query = "SELECT * FROM employee;"
    connection.query(query, (err, res) => {
        if (err) throw err;
        // For each row in the table push the first name and last name into the employees array.
        res.forEach(employee => {
            employees.push(`${employee.first_name} ${employee.last_name}`)
        });
    })
    // Return the employees array.
    return employees
}

// Array that will hold the name of all departments.
var departments = []

// Function to return the list of departments.
function getDepartments() {

    // Query all of the data from the department table. 
    const query = "SELECT * FROM department;"
    connection.query(query, (err, res) => {
        if (err) throw err;
        // For each row in the table push only the title into the department array.
        res.forEach(row => {
            departments.push(row.department)
        });
    })
    // Return the departments array.
    return departments
}

// Function to view the roles in the console.
function viewRoles() {
    const query = "SELECT title, salary, department FROM role INNER JOIN department ON role.department_id = department.id ORDER BY department ASC"
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res)
        init()
    })
}

// Function to view all departments in the console.
function viewDepartments() {
    const query = "SELECT * FROM department"
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res)
        init()
    })
}

// Function to update an employee's role.
function updateRole() {

}

// // Function to update an employee's manager.
// function updateManager() {

// }
// // Function to delete a department
// function deleteDept() {

// }
// // Function to delete a role
// function deleteRole() {

// }
// // Function to delete an employee
// function deleteEmp() {

// }
// // Function to view the budget of a department
// function viewBudget() {

// }