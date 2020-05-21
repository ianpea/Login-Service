// Firebase currently authenticated user.
var currentUser;
// Regex for checking if username is taken. Includes: a-z, A-Z, 0-9, !, @, -, _, 
// with a minimum of 5 characters
// maximum of 30 characters.
var usernameRegex = /^[a-zA-Z0-9.!@\-_]{5,30}$/;
// Regex for checking a password between 6 to 20 characters which contain
// at least one numeric digit, one uppercase and one lowercase letter.
var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
// Regex for country code.
var countryCodeRegex = /^(\+?\d{1,3}|\d{1,4})$/;
// Check for is username taken.
var isCheckingUsername = false;


$("#inputUsername").on('keyup', function ()
{
    validateUsername($("#inputUsername").val());
});

$("#inputPassword, #inputConfirmPassword").on('keyup', function ()
{
    validatePassword($("#inputPassword").val(), $("#inputConfirmPassword").val());
});

$("#button-register").click(function ()
{
    spinnerLoading(this, "", null);
    register(
        $("#inputEmail").val(),
        $("#inputPassword").val(),
        $("#inputConfirmPassword").val(),
        $("#inputUsername").val(),
        $("#inputDateOfBirth").val(),
        $("#inputCountryCode").val(),
        $("#inputPhoneNumber").val()
    );
});

$("#button-to-login-page").click(function ()
{
    firebase.auth().signOut();
    spinnerLoading(this, "", null);
    window.location.assign("../Views/index.html");
});

function validateCountryCode(countryCode)
{
    // Check if countryCode mataches the regex.
    if (!countryCode.match(countryCodeRegex))
    {
        createAlert("Invalid country code, examples: 60, 3, 33...");
        stopSpinnerLoading($("#button-register"), "Register");
        return false;
    } else
        return true;
}

function register(email, password, confirmPassword, username, dateOfBirth, countryCode, phoneNumber)
{
    if (!validateCountryCode(countryCode))
    {
        stopSpinnerLoading($("#button-register"), "Register");
        return;
    }

    validateUsername(username).then(function (isAvailable)
    {
        if (isAvailable)
        {
            if (!validatePassword(password, confirmPassword))
            {
                stopSpinnerLoading($("#button-register"), "Register");
                console.log("Password does not match.");
                return;
            }
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function ()
                {
                    firebase.auth().signInWithEmailAndPassword(email, password).then(function ()
                    {
                        writeUserData(username, dateOfBirth, countryCode, phoneNumber);
                    });
                }).catch(function (error)
                {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    console.log(errorCode);
                    switch (errorCode)
                    {
                        case "auth/email-already-in-use":
                            createAlert(`Email already in use`);
                            break;
                        case "auth/invalid-email":
                            createAlert(`Invalid email`);
                            break;
                        case "auth/weak-password":
                            createAlert(`Password is too weak, must be more than 6 characters`);
                            break;
                        default:
                            break;
                    }
                    stopSpinnerLoading($("#button-register"), "Register");
                    // ...
                });
        } else
        {
            stopSpinnerLoading($("#button-register"), "Register");
            console.log("Username not available.");
        }
    });
}

function writeUserData(username, dateOfBirth, countryCode, phoneNumber)
{
    firebase.database().ref('users/' + currentUser.uid).set({
        email: currentUser.email,
        dateOfBirth: dateOfBirth,
        countryCode: countryCode,
        phoneNumber: phoneNumber,
    }).catch(function (error)
    {
        console.log(error.code);
    });

    firebase.database().ref('usernames/' + username).set({
        uid: currentUser.uid,
    }).catch(function (error)
    {
        console.log(error.code);
    }).then(function ()
    {
        firebase.auth().signOut();
        createModal(
            "Registration successful!",
            "You have successfully registered your account <b>" + username + "</b>.",
            "../Views/index.html",
            "Return to Login",
        );
    });
}

firebase.auth().onAuthStateChanged(function (user)
{
    if (user)
    {
        // User is signed in.
        isSignedIn = true;
        var email = user.email;
        currentUser = user;

        console.log(currentUser.email + " has registered & logged in. ");

    } else
    {
        isSignedIn = false;
        // User is signed out.
        if (currentUser != null)
            console.log(currentUser.email + " has logged out. ");
    }
});