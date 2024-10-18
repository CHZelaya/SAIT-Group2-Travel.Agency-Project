/**-----------------------------------------------------------------------------------------------------------------------
 * ?                                                     ABOUT
 * @author         :  Carlos Hernandez-Zelaya
 * @email          :  carlos.hernandezZelaya@edu.sait.ca
 * @project        :  Group 2 Threaded Project
 *-----------------------------------------------------------------------------------------------------------------------**/

/**------------------------------------------------------------------------
 **                            DATABASE INITIALIZATION
 *------------------------------------------------------------------------**/

const {
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_NAME,
} = process.env


//importing mysql module
const mysql = require('mysql2');

//creating connection string using createConnection()
const con = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    database: DB_NAME,
    password: DB_PASS
});
  
//exporting the connection for use in any js file
module.exports = con;