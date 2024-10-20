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
const bodyParser = require('body-parser');

const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
const express = require('express');
const app = express();
const session = require('express-session');

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

//*Countdown Page
exports.getCountdownPage = (req, res) => {
    console.log("getCountdownPage method is being called.");
    res.render('../views/pages/countdown.ejs');

};

//*Contact Page
exports.getContactPage = (req, res) => {
    console.log('getContactPage is being called. ')
    res.render('../views/pages/contact.ejs')

}

exports.getRegisterPage = (req, res) => {
    console.log('getRegisterPage is being called . ')
    res.render('../views/pages/register.ejs')

}


//* Vacations Page

exports.getVacationPage = async (req, res) => {

    // Render the vacation page with an empty packages array initially, showing only the form to add the phone number
    res.render('../views/pages/vacation.ejs', { packages: [], showRegistrationLink: false, userChecked: false, customerFName: '' })
}


//*Contact Page
exports.getContactPage = async (req, res) => {
    const sql = `
        SELECT agents.AgtFirstName, agents.AgtLastName, agents.AgtBusPhone, agents.AgtEmail, agents.AgtPosition,
        agencies.AgncyAddress, agencies.AgncyCity, agencies.AgncyProv, agencies.AgncyPostal, agencies.AgncyCountry, agencies.AgncyPhone
        FROM agents
        JOIN agencies ON agents.AgencyId = agencies.AgencyId
    `;


    db.query(sql, (err, results) => {
        if (err) throw err;

        const agentsWithAgencyData = results.map(agent => ({
            firstName: agent.AgtFirstName,
            lastName: agent.AgtLastName,
            busPhone: agent.AgtBusPhone,
            email: agent.AgtEmail,
            position: agent.AgtPosition,
            address: agent.AgncyAddress,
            city: agent.AgncyCity,
            province: agent.AgncyProv,
            postal: agent.AgncyPostal,
            country: agent.AgncyCountry,
            agencyPhone: agent.AgncyPhone
        }));

        console.log("getContactPage method is being called.");
        res.render('../views/pages/contact.ejs', { agents: agentsWithAgencyData });
    });
}

//* Review Form Page
exports.getReviewForm = (req, res) => {
    console.log("getOrderForm method is being called. ")
    res.render('../views/pages/reviewform.ejs')
}



//* Order Form Page

exports.getOrderForm = (req, res) => {
    console.log("getOrderForm method is being called.")
    res.render('../views/pages/orderform.ejs');
}

exports.getVacation1 = (req, res) => {
    res.render('../views/pages/vacation1.ejs');
};


/**------------------------------------------------------------------------
 **                            POST METHODS
 *------------------------------------------------------------------------**/


exports.checkRegistration = (req, res) => {
    // Grab phone number from form.
    const userPhone = req.body.phone.replace(/\D/g, ''); // Normalize phone number

    // Run query to check if phone number exists
    const query = 'select * from customers where CustHomePhone = ?'
    db.query(query, [userPhone], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }

        // Check if the user is registered. 
        if (results.length > 0) {
            console.log(results)
            //Grab Customers first name
            const customerFName = results[0].CustFirstName
            console.log(customerFName)
            // User is registered, fetch vacation packages. 
            const sql = 'select * from packages'
            db.query(sql, (err, result, field) => {
                if (err) throw err;

                const packagesWithCleanData = result.map(package => {
                    //Declaring variables targeting specific bits of information from the sql query
                    const startDate = package.PkgStartDate;
                    const endDate = package.PkgEndDate;
                    const price = package.PkgBasePrice;

                    // Get the date part in YYYY-MM-DD format
                    const cleanedStartDate = startDate.toISOString().substring(0, 10);
                    const cleanedEndDate = endDate.toISOString().substring(0, 10);
                    // Removes trailing zeros after the decimal point
                    const cleanedPrice = price.replace(/\.?0+$/, '');

                    //Return a new object with original package data and cleaned values
                    return {
                        ...package,
                        cleanedStartDate,
                        cleanedEndDate,
                        cleanedPrice
                    };
                })

                console.log("getVacationPage method is being called. ");
                res.render('../views/pages/vacation.ejs', { packages: packagesWithCleanData, showRegistrationLink: false, userChecked: true, customerFName: customerFName });
            })
        } else {
            // User is not registered
            console.log('User is not registered. Render Registration Link');
            res.render('../views/pages/vacation.ejs', { packages: [], showRegistrationLink: true, userChecked: true, customerFName: '' });
        }
    })
}

//*Register Page

exports.postRegisterData = (req, res) => {
    const { firstName, lastName, email, phoneNumber, busphone, city, province, postal, country, address, otherDetails } = req.body;
    const registerUserQuery = 'INSERT INTO customers (CustFirstName, CustLastName, CustAddress, CustCity, CustProv, CustPostal, CustCountry, CustHomePhone, CustBusPhone, CustEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(registerUserQuery, [firstName, lastName, email, phoneNumber, busphone, city, province, postal, country, address, otherDetails], (error, results) => {
        if (error) throw error;

        req.session.phoneNumber = phoneNumber;
        res.redirect('/vacation');
    });
};

exports.registerCustomer = (req, res) => {
    const { firstName, lastName, email, phone, busphone, city, province, postal, country, address } = req.body;

    const sql = `
        INSERT INTO customers (CustFirstName, CustLastName, CustEmail, CustHomePhone, CustBusPhone, 
        CustCity, CustProv, CustPostal, CustCountry, CustAddress)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [firstName, lastName, email, phone, busphone, city, province, postal, country, address], (err, result) => {
        if (err) {
            console.error("Error inserting customer: ", err);

            return res.status(500).send("An error occurred while registering the customer.");
        }

        console.log("Customer registered successfully with ID:", result.insertId);
        res.redirect('/'); // Redirect to a success page or the home page

        const sqlSelect = 'SELECT * FROM customers WHERE CustomerID = ?';
        db.query(sqlSelect, [result.insertId], (err, registerResult) => {
            if (err) throw err;

            // Rendering registration information in thank you page
            res.render("../views/pages/tyregister", {
                titlePage: "Thank You!",
                register: registerResult[0]
            });
        });
    });
};





exports.checkIfRegistered = async (req, res) => {
    const userPhoneNumber = req.body.CustHomePhone // get the phone number from the form

    // Query to check if the phone number exists
    const query = 'SELECT * FROM customers where CustHomePhone = ?'
    db.query(query, [userPhoneNumber], (error, results) => {
        if (error) {
            return console.error('Something went wrong', error);
        }

        const isRegistered = results.length > 0; // Check if the user is registered
        if (isRegistered) {
            res.render('vacation', { isRegistered: true, userPhoneNumber });
        } else {
            res.render('vacation', { isRegistered: false, userPhoneNumber: '' });
        }
    })

}


/**------------------------------------------------------------------------
 **                            USE METHODS
 *------------------------------------------------------------------------**/
//*404 Page
exports.handle404 = (req, res) => {
    console.log("404 error");
    res.status(404).render('../views/pages/404.ejs', { titlePage: "404 Page Not Found" });
};


