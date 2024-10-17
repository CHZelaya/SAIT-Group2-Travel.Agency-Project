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
const validator = require('validator')
const db = require('../database/database')


/**------------------------------------------------------------------------
 **                            DATABASE CONNECTION
 *------------------------------------------------------------------------**/

db.connect((err) => {
    if (err) throw err;
    console.log('Connection to db successful');
});



/**------------------------------------------------------------------------
 **                            GET METHODS
 *------------------------------------------------------------------------**/

//* Home Page aka Index.html
exports.getHomePage = (req, res) => {
    // Send the index.html file located in the public folder
    console.log("getHomePage method is being called. ")
    res.render('../views/pages/index.ejs')

};

//*Contact Page
exports.getContactPage = (req, res) => {
    console.log('getContactPage is being called. ')
    res.render('../views/pages/contact.ejs')

}

//*Register Page
exports.getRegisterPage = (req, res) => {
    console.log('getRegisterPage is being called . ')
    res.render('../views/pages/register.ejs')

}

//* Vacations Page
exports.getVacationPage = (req, res) => {
    console.log("getVacationPage method is being called. ")
    res.render('../views/pages/vacation.ejs')
}

//* Order Form Page
exports.getOrderForm = (req, res) => {
    console.log("getOrderForm method is being called. ")
    res.render('../views/pages/orderform.ejs')
}


