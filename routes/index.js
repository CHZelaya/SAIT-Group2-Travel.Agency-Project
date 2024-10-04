// *  Setting up environment
const express = require('express');
const app = express();
const port = 3000;
const path = require('path')


app.set('view engine', 'ejs'); // * Template engine to dynamically generate HTML
app.use(express.urlencoded({ extended: true })); //*  Ability to pass data between pages.

// * Setting up serve static assets
app.use('/static', express.static(path.join(__dirname, 'public'))) // * Store static assets (images, css files, random JS files) in a foler named "Public"

// * Creating routes for html pages

// * Index
app.get('/', (request, response) => {
    response.render('index', { pageTitle: 'Home Page' });
})

// * Register
app.get('/register', (request, response) => {
    response.render('register', { pageTitle: 'Register User' });
})
// * Contact
app.get('/contact', (request, response) => {
    response.render('contact', { pageTitle: 'Contact us' });
})
//  * Vacation Package
app.get('/vacation', (request, response) => {
    response.render('vacation', { pageTitle: 'Vacation Packages' });
})

// * Spinning up the Server
app.listen(port, () => {
    console.log(`Server spinning up! Listening on port ${port}`)
})

// * Setting up 404 not found and 500 error handling

app.use((request, response, next) => {
    response.status(404).send('Page not found') //* Temporary 404 Page, In place until 404.html/ejs is created.
})

app.use((err, request, response, next) => {
    console.log(err.stack);
    response.status(500).send('Something broke!') //* If error, it will console.log "Something broke", in place until proper error handling is implemented.
})