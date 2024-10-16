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
app.set('views', path.join(__dirname, 'views')); 




/**------------------------------------------------------------------------
 **                            API CONTROLLERS
 *------------------------------------------------------------------------**/
app.get('/', apiController.getHomePage);
app.get('/countdown', apiController.getCountdownPage);
app.get('/contact', apiController.getContactPage);
app.get('/register', apiController.getRegisterPage);
app.get('/vacation', apiController.getVacationPage);
app.get('/orderform', apiController.getOrderForm);

app.post('/register', apiController.registerCustomer);






/**------------------------------------------------------------------------
 **                            INITIALIZING SERVER
 *------------------------------------------------------------------------**/
// * Spinning up the Server
app.listen(PORT, () => {
    console.log(`Server spinning up! Listening on port ${PORT}`)
})