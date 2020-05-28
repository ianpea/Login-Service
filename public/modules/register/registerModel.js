// User info
var currentUser;

// Firebase
var database = firebase.database();
var auth = firebase.auth();

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
                console.log("Password not allowed.");
                return;
            }
            auth.createUserWithEmailAndPassword(email, password)
                .then(function ()
                {
                    auth.signInWithEmailAndPassword(email, password).then(function ()
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
    database.ref('users/' + currentUser.uid).set({
        email: currentUser.email,
        dateOfBirth: dateOfBirth,
        countryCode: countryCode,
        phoneNumber: phoneNumber,
    }).catch(function (error)
    {
        console.log(error.code);
    });

    database.ref('usernames/' + username).set({
        uid: currentUser.uid,
    }).catch(function (error)
    {
        console.log(error.code);
    }).then(function ()
    {
        auth.signOut();
        createModal(
            "Registration successful!",
            "You have successfully registered your account <b>" + username + "</b>.",
            "../views/index.html",
            "Return to Login",
        );
    });
}

auth.onAuthStateChanged(function (user)
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