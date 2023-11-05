# Employee Supervisors App

Employee Supervisors App is a full-stack web application built with Angular for the frontend, Node.js with Express for the backend, and MySQL for the database. This app helps manage employees and supervisors while displaying the hierarchy of employees.

## Prerequisites

Before running the app locally, make sure you have the following prerequisites installed on your system:

1. **Clone the Project:** Clone this project from the GitHub repository.
   ```sh
   git clone https://github.com/mohamedSamir97/EmployeeSupervisors.git
   ```

2. **Node.js:** Install Node.js from [here](https://nodejs.org/).

3. **Install Angular cli**
   ```sh
   npm install -g @angular/cli
    ```
4. **XAMPP with MySQL:** Download and install XAMPP, which includes MySQL, from [here](https://www.apachefriends.org/download.html).

5. **Start Apache and MySQL:** Start the Apache and MySQL services using the XAMPP control panel. You can access the MySQL database via phpMyAdmin at `http://localhost/phpmyadmin/`.

6. **Install Backend Dependencies:** Navigate to the `backend` folder directory in your terminal and run the following command to install the required Node.js modules:

    ```sh
    npm install
    ```

7. **Install Frontend Dependencies:** Navigate to the `frontend` folder directory in your terminal and run the following command to install the required Node.js modules:

    ```sh
    npm install
    ```

8. **Configure Backend Environment:**
    - Create a `.env` file in the `backend` folder and configure your database settings. Example:

    ```dotenv
    APP_PORT=3000
    DB_PORT=3306
    DB_HOST='localhost'
    DB_USER=root
    DB_PASS=
    MYSQL_DB=employeedb
    JWT_KEY=yourToken
    ```

9. **Run Backend Server:** In the terminal, navigate to the `backend` folder and run the following command to start the Node.js server:

    ```sh
    node app.js
    ```

   The server will run on the URL defined in `APP_PORT` from the `.env` variables.

10. **Run Frontend Angular App:** In the terminal, navigate to the `frontend` folder and run the following command to start the Angular app and open it in your default web browser:

    ```sh
    ng serve --open
    ```

    The frontend app will open in your browser at `http://localhost:4200/` by default.

11. **Configure CORS Policy (Optional):**
    - In the `backend` folder, open the `app.js` file.
    - Change the `origin` in the CORS middleware to the URL where your frontend app is hosted. By default, it is set to `http://localhost:4200`.

    ```javascript
    app.use(cors({
        origin: 'http://localhost:4200', // Change to your frontend app URL
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        optionsSuccessStatus: 200,
    }));
    ```
12. **Configure Backend apiUrl In Angular**
    - Configure the apiUrl of backend in environments/environment.ts
    - Here is the apiUrl replace with your backend url

    ```javascript
    export const environment = {
    production: false,
    apiUrl:'http://localhost:3000/api/', //your backend url here
    };
    ``` 
13. **Login Credentials:**
    - To log in, use the credentials found in the `dbInit.js` file.
      - Email: admin@test.test
      - Password: admin

14. **JWT Token:** JWT tokens are valid for 24 hours, after which they will expire, requiring you to login again.

## Usage

Explore the various pages and features of the app.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

