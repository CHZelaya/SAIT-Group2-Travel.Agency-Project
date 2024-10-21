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
//GET
app.get('/', apiController.getHomePage);
app.get('/countdown', apiController.getCountdownPage);
app.get('/contact', apiController.getContactPage);
app.get('/register', apiController.getRegisterPage);
app.get('/vacation', apiController.getVacationPage);
app.get('/orderform', apiController.getOrderForm);
app.get('/reviewform', apiController.getReviewForm);

//POST
app.post('/check-registration', apiController.checkRegistration);
// app.post('/check-phone', apiController.postCheckPhone)
// app.post('/register', apiController.postRegisterData)
app.post('/complete-registration', apiController.registerCustomer);
app.post('/booking', apiController.submitBooking)

//USE
app.use(apiController.handle404);








/**------------------------------------------------------------------------
 **                            INITIALIZING SERVER
 *------------------------------------------------------------------------**/
// * Spinning up the Server
app.listen(PORT, () => {
    console.log(`Server spinning up! Listening on port ${PORT}`)
})