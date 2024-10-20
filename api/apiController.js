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
    res.render('../views/pages/vacation.ejs', { packages: [], showRegistrationLink: false, userChecked: false, customerFName: '', userPhoneNumber: '' })
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
    const userPhoneNumber = req.query.phone
    console.log('USERPHONENUMBER:', userPhoneNumber)
    const packageName = req.query.package
    const query = 'SELECT * from customers WHERE CustHomePhone = ?'
    db.query(query, [userPhoneNumber], (err, result) => {
        if (err) {
            console.error(err)
        }
        console.log('RESULT:', result)
        console.log("getOrderForm method is being called.")
        res.render('../views/pages/orderform.ejs', { result: result[0], packageName });
    })

}



/**------------------------------------------------------------------------
 **                            POST METHODS
 *------------------------------------------------------------------------**/


exports.checkRegistration = (req, res) => {
    // Grab phone number from form.
    const userPhoneNumber = req.body.phone.replace(/\D/g, ''); // Normalize phone number

    // Run query to check if phone number exists
    const query = 'select * from customers where CustHomePhone = ?'
    db.query(query, [userPhoneNumber], (err, results) => {
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

                    //! Because the PkgStartDate/EndDate are objects, we need to use toISOString() to parse it into a usable ISO 8601 standard, of which we can then run string methods on it to manipulate the data.

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
                res.render('../views/pages/vacation.ejs', { packages: packagesWithCleanData, showRegistrationLink: false, userChecked: true, customerFName: customerFName, userPhoneNumber: userPhoneNumber });
            })
        } else {
            // User is not registered
            console.log('User is not registered. Render Registration Link');
            res.render('../views/pages/vacation.ejs', { packages: [], showRegistrationLink: true, userChecked: true, customerFName: '', userPhoneNumber: '' });
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


//Submit Bookings Data

exports.submitBooking = async (req, res) => {
    const { currentDate, randomString, traveler, travelType, vacation, firstName, lastName, email, phone, busphone, city, province, postal, country, address } = req.body

    const errors = []; // Array to store errors (if any)

    //Validate first name length
    if (!validator.isLength(firstName, { min: 1, max: 50 })) {
        errors.push('First name must be between 1 - 50 characters');
    }
    //Validate last name length
    if (!validator.isLength(lastName, { min: 1, max: 50 })) {
        errors.push('Last name must be between 1 - 50 characters');
    }
    //Validate email is in email format
    if (!validator.isEmail(email)) {
        errors.push("Invalid Email format");
    }
    //Validate home phone number
    if (!validator.isMobilePhone(phone, 'any')) {
        errors.push("Invalid Phone Number");

    //Validate business phone number
    if (!validator.isMobilePhone(busphone, 'any')) {
        errors.push("Invalid Phone Number");
    }
    //Validate city's length
    if (!validator.isLength(city, { min: 1, max: 50 })) {
        errors.push('City must be between 1 and 50 characters');
    }
    //Validate province's length
    if (!validator.isLength(province, { min: 1, max: 50 })) {
        errors.push("Province must be between 1 and 50 characters");
    }
    //validate postalcode in "any" format
    if (!validator.isPostalCode(postal, 'any')) {
        errors.push("Invalid postal code.")
    }
    //Validate country's length
    if (!validator.isLength(country, { min: 1, max: 50 })) {
        errors.push("Province must be between 1 and 50 characters");
    }
    //validate address length
    if (!validator.isLength(address, { min: 1, max: 500 })) {
        errors.push("Length must be between 1 and 500 characters. ")
    }
    if (!validator.isAlphanumeric) {
        errors.push('Invalid format in Address Field')
    }

    if (errors.length > 0) {
        return res.render('../views/pages/orderform.ejs')
    } else {



        const results = { currentDate, randomString, traveler, travelType, vacation, firstName, lastName, email, phone, busphone, city, province, postal, country, address }


        try {
            const newBooking = await Booking.create({
                currentDate, randomString, traveler, travelType, vacation, firstName, lastName, email, phone, busphone, city, province, postal, country, address
            });
            res.render('../views/pages/thankyou.ejs', { results: results })


        } catch (error) {
            console.error("I broke!", error)
        }

        console.log('thankyou is being called successfully')
    }
}
}


/**------------------------------------------------------------------------
 **                            USE METHODS
 *------------------------------------------------------------------------**/
//*404 Page
exports.handle404 = (req, res) => {
    console.log("404 error");
    res.status(404).render('../views/pages/404.ejs', { titlePage: "404 Page Not Found" });
};

