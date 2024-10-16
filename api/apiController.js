/**-----------------------------------------------------------------------------------------------------------------------
 * ?                                                     ABOUT
 * @author         :  Carlos Hernandez-Zelaya
 * @email          :  carlos.hernandezZelaya@edu.sait.ca
 * @project        :  Group 2 Threaded Project
 *-----------------------------------------------------------------------------------------------------------------------**/

/**------------------------------------------------------------------------
 **                            IMPORTS
 *------------------------------------------------------------------------**/
const path = require('path');
// const User = require('../models/userModel')
// const sequelize = require('../database/database.js');
// const validator = require('validator')


/**------------------------------------------------------------------------
 **                            GET METHODS
 *------------------------------------------------------------------------**/

//* Home Page aka Index.html
exports.getHomePage = (req, res) => {
    // Send the index.html file located in the public folder
    console.log("getHomePage method is being called. ")
    res.sendFile(path.join(__dirname, '../public/html/index.html'));

};

//*Contact Page
exports.getContactPage = (req, res) => {
    console.log('getContactPage is being called. ')
    res.sendFile(path.join(__dirname, '../public/html/contact.html'))

}

//*Register Page
exports.getRegisterPage = (req, res) => {
    console.log('getRegisterPage is being called . ')
    res.sendFile(path.join(__dirname, '../public/html/register.html'))

}

//* Vacations Page
exports.getVacationPage = (req, res) => {
    console.log("getVacationPage method is being called. ")
    res.sendFile(path.join(__dirname, '../public/html/vacation.html'))
}

//* Order Form Page
exports.getOrderForm = (req, res) => {
    console.log("getOrderForm method is being called. ")
    res.sendFile(path.join(__dirname, '../public/html/orderform.html'))
}


