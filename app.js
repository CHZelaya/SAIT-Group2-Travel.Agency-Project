/**-----------------------------------------------------------------------------------------------------------------------
 * ?                                                     ABOUT
 * @author         :  Carlos Hernandez-Zelaya
 * @email          :  carlos.hernandezZelaya@edu.sait.ca
 * @project        :  Group 2 Threaded Project
 *-----------------------------------------------------------------------------------------------------------------------**/

/**------------------------------------------------------------------------
 **                            EXPRESS/IMPORTS
 *------------------------------------------------------------------------**/
const express = require('express');
const app = express();
const PORT = 3000
const path = require('path')
require('dotenv').config()
const apiController = require('./api/apiController');



/**------------------------------------------------------------------------
 **                            MIDDLEWARE
 *------------------------------------------------------------------------**/
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //*  Ability to pass data between pages.
// * Setting up serve static assets
app.use('/static', express.static(path.join(__dirname, 'public'))) // * Store static assets (images, css files, random JS files) in a foler named "Public"
app.set('view engine', 'ejs');



/**------------------------------------------------------------------------
 **                            API CONTROLLERS
 *------------------------------------------------------------------------**/
app.get('/', apiController.getHomePage);
app.get('/contact', apiController.getContactPage);
app.get('/register', apiController.getRegisterPage);
app.get('/vacation', apiController.getVacationPage);
app.get('/orderform', apiController.getOrderForm);
// app.get('/login', apiController.getLoginForm);



/**------------------------------------------------------------------------
 **                            ORDER MANAGEMENT
 *------------------------------------------------------------------------**/


const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const connection = require('./database/database');

const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
console.log(secretKey);

const sessionStore = new MySQLStore(process.env);


 app.use(session({
     secret: secretKey,
     resave: false,
     saveUninitialized: true
 }));


 app.get('/orderform', (req, res) => {
    if (req.session.userPhone) {
        res.render('orderform');
    } else {
        res.redirect('/login');
    }
});

app.post('/login', (req, res) => {
    const userPhone = req.body.phone;
    const checkUserQuery = 'SELECT * FROM users WHERE CustHomePhone = ?';

    connection.query(checkUserQuery, [userPhone], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            req.session.userPhone = userPhone;
            res.redirect('/orderform');
        } else {
            res.redirect('/register');
        }
    });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const userFirstName = req.body.firstName;
    const userLastName = req.body.lastName;
    const userAddress = req.body.address;
    const userCity = req.body.city;
    const userProvince = req.body.province;
    const userPostalCode = req.body.postal;
    const userCountry = req.body.country;
    const userPhone = req.body.phone;
    const userBusphone = req.body.busphone;
    const userEmail = req.body.email;
    const registerUserQuery = 'INSERT INTO customers (CustFirstName, CustLastName, CustAddress, CustCity, CustProv, CustPostal, CustCountry, CustHomePhone, CustBusPhone, CustEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    connection.query(registerUserQuery, [userPhone, userEmail], (error, results) => {
        if (error) throw error;
        req.session.userPhone = userPhone;
        res.redirect('/orderform');
    });
});






/**------------------------------------------------------------------------
 **                            INITIALIZING SERVER
 *------------------------------------------------------------------------**/
// * Spinning up the Server
app.listen(PORT, () => {
    console.log(`Server spinning up! Listening on port ${PORT}`)
})