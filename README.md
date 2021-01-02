# Employee Tracker



## Description
This is a CLI app that allows a user to interact with an SQL database containing data for their workforce. This app uses Node.js, Inquirer to interact with the user, and mySQL to interact with the database. The functions that are available are 
- Adding (employees, roles, or departments)
- Deleting (employees, roles, or departments)
- Viewing (employees, employees by department, roles, or departments)
- Updating (employee's manager, or employee's role).

## Table of Contents
- [Installation](#installation)        
- [Usage](#usage)           

- [Contributing](#contributing)
- [Tests](#tests)
- [Questions?](#questions)
           
## Installation
Enter the following command into the command line to install dependencies: ```npm i```

After dependencies are done installing the initial database will need to be created. Note that when creating databases the password for your personal SQL root server will need to be entered.

In order to initialize the database enter the command: ```npm run create-db``` 

In order to try the application with test data run the following command: ```npm run seed-db```

Finally, within the app.js file the data for the mysql connection will need to be changed to match your connection's data in order to work.

![Connection](/assets/connectionEdit.jpg)

## Usage
This application is started and used within the command line. In order to start the application enter the command: ```npm start```

The user will then be prompted a series of questions and displayed a list of results based on their responses. The menu includes an Exit option to close the application. 

*Questions that ask the user to confirm their selection do not function, these are a makeshift fix to allow time for the choices to load on the following question.* 



## Contributing
Please contact me at the links below. 

## Tests
This project does not have any tests.
           
## Questions?

View more of my work at the Github link below or contact me at the email below.

Github: [alexander-camacho](https://github.com/alexander-camacho)

Email: alsbrain@optonline.net