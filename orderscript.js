
//automatically prompt current date
function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


document.getElementById('currentDate').value = getCurrentDate();

//generates random Booking ID
function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    document.getElementById('randomString').value = result;
}

window.onload = generateRandomString;

//validation

document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    // clears previous error messages
    clearErrorMessages();

     // gets values from fields and the trim ignores any white spaces
    const formData = {
        travelType: document.getElementById("travelType").value.trim(),
        traveler: document.getElementById("traveler").value.trim(),
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        busphone: document.getElementById("busphone").value.trim(),
        city: document.getElementById("city").value.trim(),
        province: document.getElementById("province").value.trim(),
        postal: document.getElementById("postal").value.trim(),
        country: document.getElementById("country").value.trim(),
        address: document.getElementById("address").value.trim()
    };

    let isValid = validateForm(formData);

    // If all validated then this will show confirmation message
    if (isValid) {
        if (confirm("Do you want to submit the form?")) {
            alert("Form submitted successfully!");
            // Reset 
            document.getElementById("registrationForm").reset();
        }
    }
});

// function to clear error messages
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error');
    errorMessages.forEach(msg => msg.style.display = 'none');
}

// function to validate the form fields
function validateForm(data) {
    let isValid = true;

    // this if statements argues that if the field is an empty string then it will display text in p tag and will consider isValid as false which will not validate
    if (!data.travelType) {
        displayError("travelTypeDesc");
        isValid = false;
    }

    const travelerPattern = /^\d{1,3}$/;
    if (data.traveler === "" || !travelerPattern.test(data.traveler)) {
        displayError("travelerDesc");
        isValid = false;
    }
    
    const firstNamePattern = /^[a-zA-Z]{2,25}$/;
    if (data.firstName === "" || !firstNamePattern.test(data.firstName)) {
        displayError("firstDesc");
        isValid = false;
    }

    const lastNamePattern = /^[a-zA-Z]{2,25}$/;
    if (data.lastName === "" || !lastNamePattern.test(data.lastName)) {
        displayError("lastDesc");
        isValid = false;
    }

    // first it checks for regular expression and then validate if the form is not empty
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (data.email === "" || !emailPattern.test(data.email)) {
        displayError("emailDesc");
        isValid = false;
    }

    const phonePattern = /^\d{1}-\d{3}-\d{3}-\d{4}$/;
    if (data.phone === "" || !phonePattern.test(data.phone)) {
        displayError("phoneDesc");
        isValid = false;
    }

    const busphonePattern = /^\d{1}-\d{3}-\d{3}-\d{4}$/;
    if (data.busphone === "" || !busphonePattern.test(data.busphone)) {
        displayError("busphoneDesc");
        isValid = false;
    }

    const cityPattern = /^[a-zA-Z]{2,50}$/;
    if (data.city === "" || !cityPattern.test(data.city)) {
        displayError("cityDesc");
        isValid = false;
    }

    const provincePattern = /^[a-zA-Z]{2}$/;
    if (data.city === "" || !provincePattern.test(data.province)) {
        displayError("provinceDesc");
        isValid = false;
    }

    const postalPattern = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (data.postal === "" || !postalPattern.test(data.postal)) {
        displayError("postalDesc");
        isValid = false;
    }

    const countryPattern = /^[a-zA-Z]{2,25}$/;
    if (data.country === "" || !countryPattern.test(data.country)) {
        displayError("countryDesc");
        isValid = false;
    }

    if (data.address === ""|| data.address.length > 75) {
        displayError("addressDesc");
        isValid = false;
    }
// ends the function and return all values above to see if isValid is true or false
    return isValid; 
}

// this displays error messages
function displayError(elementId) {
    document.getElementById(elementId).style.display = 'block';
}

// Reset button confirmation
document.getElementById("resetButton").addEventListener("click", function(event) {
    if (!confirm("Are you sure you want to reset the form?")) {
        event.preventDefault(); // stops reset if user cancels
    } else {
        clearErrorMessages(); // clears error messages on reset
    }
});


// script using onfocus for pop up description wrapped in p tags for every field, css is applied and message will appear at bottom of the field

// this function hides all the description in the array right away and runs a loop checking to see if its exceptDesc
function hideAllDescriptionsExcept(exceptDesc) {
    const descriptions = [
        travelTypeDesc, travelerDesc, firstDesc, lastDesc, emailDesc, phoneDesc,
        cityDesc, provinceDesc, busphoneDesc, postalDesc, countryDesc, addressDesc
    ];
    descriptions.forEach(desc => {
        if (desc !== exceptDesc) {
            desc.style.display = 'none';
        }
    });
}

// selects input field and description, when input is selected its shows description related to it using onfocus and displays inline but hides all other descriptions
const travelTypeInput = document.getElementById("travelType");
const travelTypeDesc = document.getElementById("travelTypeDesc");
travelTypeInput.onfocus = () => {
    travelTypeDesc.style.display = 'inline';
    hideAllDescriptionsExcept(travelTypeDesc);
};

const travelerInput = document.getElementById("traveler");
const travelerDesc = document.getElementById("travelerDesc");
travelerInput.onfocus = () => {
    travelerDesc.style.display = 'inline';
    hideAllDescriptionsExcept(travelerDesc);
};

const firstInput = document.getElementById("firstName");
const firstDesc = document.getElementById("firstDesc");
firstInput.onfocus = () => {
    firstDesc.style.display = 'inline';
    hideAllDescriptionsExcept(firstDesc);
};

const lastInput = document.getElementById("lastName");
const lastDesc = document.getElementById("lastDesc");
lastInput.onfocus = () => {
    lastDesc.style.display = 'inline';
    hideAllDescriptionsExcept(lastDesc);
};

const emailInput = document.getElementById("email");
const emailDesc = document.getElementById("emailDesc");
emailInput.onfocus = () => {
    emailDesc.style.display = 'inline';
    hideAllDescriptionsExcept(emailDesc);
};

const phoneInput = document.getElementById("phone");
const phoneDesc = document.getElementById("phoneDesc");
phoneInput.onfocus = () => {
    phoneDesc.style.display = 'inline';
    hideAllDescriptionsExcept(phoneDesc);
};

const busphoneInput = document.getElementById("busphone");
const busphoneDesc = document.getElementById("busphoneDesc");
busphoneInput.onfocus = () => {
    busphoneDesc.style.display = 'inline';
    hideAllDescriptionsExcept(busphoneDesc);
};

const cityInput = document.getElementById("city");
const cityDesc = document.getElementById("cityDesc");
cityInput.onfocus = () => {
    cityDesc.style.display = 'inline';
    hideAllDescriptionsExcept(cityDesc);
};

const provinceInput = document.getElementById("province");
const provinceDesc = document.getElementById("provinceDesc");
provinceInput.onfocus = () => {
    provinceDesc.style.display = 'inline';
    hideAllDescriptionsExcept(provinceDesc);
};

const postalInput = document.getElementById("postal");
const postalDesc = document.getElementById("postalDesc");
postalInput.onfocus = () => {
    postalDesc.style.display = 'inline';
    hideAllDescriptionsExcept(postalDesc);
};

const countryInput = document.getElementById("country");
const countryDesc = document.getElementById("countryDesc");
countryInput.onfocus = () => {
    countryDesc.style.display = 'inline';
    hideAllDescriptionsExcept(countryDesc);
};

const addressInput = document.getElementById("address");
const addressDesc = document.getElementById("addressDesc");
addressInput.onfocus = () => {
    addressDesc.style.display = 'inline';
    hideAllDescriptionsExcept(addressDesc);
};
