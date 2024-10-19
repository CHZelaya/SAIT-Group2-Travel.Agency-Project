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

document.getElementById("review-form").addEventListener("submit", function(event) {
    event.preventDefault(); 

    // clears previous error messages
    clearErrorMessages();

     // gets values from fields and the trim ignores any white spaces
    const formData = {
        email: document.getElementById("email").value.trim(),
        currentDate: document.getElementById("currentDate").value.trim(),
        randomString: document.getElementById("randomString").value.trim(),
        rate: document.querySelector('input[name="inlineRadioOptions"]:checked').value,
        comments: document.getElementById("comments").value.trim()
    };

    let isValid = validateForm(formData);

    

    // If all validated then this will show confirmation message
    if (isValid) {
        if (confirm("Do you want to submit the form?")) {
            alert("Form submitted successfully!");
            // Reset 
            clearErrorMessages()
            const OKMessages = document.getElementById('okmessage');

            /** TODO: Here we need save fromData To database 
             * Also we need change randomcode and connect to correct booking id
             */
            console.log(formData);

            // Show thanks message
            OKMessages.style.display = 'block';
            setTimeout(() => {
                const OKMessages = document.getElementById('okmessage');
                OKMessages.style.display = 'none';
            }, 4000)
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

    // first it checks for regular expression and then validate if the form is not empty
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (data.email === "" || !emailPattern.test(data.email)) {
        displayError("emailDesc");
        isValid = false;
    }
    const checked = [...document.getElementsByName("inlineRadioOptions")].some(c=>c.checked)
    if(!checked) {
        displayError("rateDesc");
        isValid = false;
    }

    if (data.comments === ""|| data.comments.length > 75) {
        displayError("commentsDesc");
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
        emailDesc,
        commentsDesc
    ];
    descriptions.forEach(desc => {
        if (desc !== exceptDesc) {
            desc.style.display = 'none';
        }
    });
}

// selects input field and description, when input is selected its shows description related to it using onfocus and displays inline but hides all other descriptions

const emailInput = document.getElementById("email");
const emailDesc = document.getElementById("emailDesc");
emailInput.onfocus = () => {
    emailDesc.style.display = 'inline';
    hideAllDescriptionsExcept(emailDesc);
};

const addressInput = document.getElementById("comments");
const addressDesc = document.getElementById("commentsDesc");
addressInput.onfocus = () => {
    addressDesc.style.display = 'inline';
    hideAllDescriptionsExcept(addressDesc);
};
