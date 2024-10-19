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
        res.render('../views/pages/vacation.ejs', { packages: packagesWithCleanData });
    })
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
//---------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true
}));

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


exports.postCheckPhone = (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const checkUserQuery = 'SELECT * FROM customers WHERE CustHomePhone = ?';

    db.query(checkUserQuery, [phoneNumber], (error, results) => {
        if (error) throw error;


        if (results.length > 0) {
            req.session.phoneNumber = phoneNumber;
            res.render('vacation', { pageTitle: "Vacation Packages" });
        } else {
            res.redirect('/register');
        }
    });
};

//handle registration data

exports.postRegisterData = (req, res) => {
    const { firstName, lastName, email, phoneNumber, busphone, city, province, postal, country, address,  otherDetails } = req.body;
    const registerUserQuery = 'INSERT INTO customers (CustFirstName, CustLastName, CustAddress, CustCity, CustProv, CustPostal, CustCountry, CustHomePhone, CustBusPhone, CustEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(registerUserQuery, [firstName, lastName, email, phoneNumber, busphone, city, province, postal, country, address,  otherDetails], (error, results) => {
        if (error) throw error;

        req.session.phoneNumber = phoneNumber;
        res.redirect('/vacation');
    });
};

/**------------------------------------------------------------------------
 **                            POST METHODS
 *------------------------------------------------------------------------**/


//*Register Page

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



/**------------------------------------------------------------------------
 **                            USE METHODS
 *------------------------------------------------------------------------**/
//*404 Page
exports.handle404 = (req, res) => {
    console.log("404 error");
    res.status(404).render('../views/pages/404.ejs', { titlePage: "404 Page Not Found" });
};


