Project Setup Instructions
To set up and run this project, please ensure you have the following installed on your device:
Node.js
npm
XAMPP

Step 1: Database Setup
Launch XAMPP and start both Apache and MySQL services.
Open your browser and go to phpMyAdmin.
Import the database by selecting the server/database/church_connect.sql file. This will set up the necessary database.

Step 2: Install Project Dependencies
Navigate to the /client directory in your terminal and run:
npm install
Repeat the above command in both the /server directory and the root directory.

Step 3: Start the Servers
Run the following command to start the Node.js server and the Next.js development server:
npm start

After completing these steps, the project should be up and running.