// User info
var currentUser;

// Local storage
var emailForSignIn;

// Firebase
var database = firebase.database();
var auth = firebase.auth();


function updateField(editField, updatedValue)
{
    var userInfo = database.ref('/users/' + currentUser.uid);

    // add back new data
    switch (editField)
    {
        case "username":
            if ($("#username-profile").html())
                database.ref('/usernames/' + $("#username-profile").html())
                    .remove()
                    .then(function ()
                    {
                        var newUsername = database.ref('/usernames/' + updatedValue);
                        newUsername.set({
                            uid: currentUser.uid,
                        }).then(function ()
                        {
                            stopSpinnerLoading($(`#button-update-${editField}`), "Update");
                            $(`#modal-popup-${editField}`).modal('toggle');
                        }).catch(function (error)
                        {
                            console.log(error.code);
                        })
                    });
            break;
        case "date-of-birth":
            userInfo.update({
                dateOfBirth: updatedValue
            }).then(function ()
            {
                $("#date-of-birth").html(`${updatedValue}`);
                stopSpinnerLoading($(`#button-update-${editField}`), "Update");
                $(`#modal-popup-${editField}`).modal('toggle');
            }).catch(function (error)
            {
                console.log(error.code);
            });
            break;
        case "country-code":
            userInfo.update({
                countryCode: updatedValue
            }).then(function ()
            {
                $("#country-code").html(`${updatedValue}`);
                stopSpinnerLoading($(`#button-update-${editField}`), "Update");
                $(`#modal-popup-${editField}`).modal('toggle');
            }).catch(function (error)
            {
                console.log(error.code);
            });
            break;
        case "phone-number":
            userInfo.update({
                phoneNumber: updatedValue
            }).then(function ()
            {
                $("#phone-number").html(`${updatedValue}`);
                stopSpinnerLoading($(`#button-update-${editField}`), "Update");

                $(`#modal-popup-${editField}`).modal('toggle');
            }).catch(function (error)
            {
                console.log(error.code);
            });
            break;
        default:
            console.log("editField undefined.");
    }
}

function logOut()
{
    auth.signOut();
}

function readUserData()
{
    var userId = auth.currentUser.uid;
    database.ref('/usernames/').orderByChild('uid').equalTo(currentUser.uid).on('child_added', function (snapshot)
    {
        var username;
        if (snapshot.key != "")
            username = snapshot.key;
        else
            username = "Username not set."

        $("#username-display").html(username);
        $("#username-profile").html(username);
    });

    database.ref('/users/' + userId).once('value').then(function (snapshot)
    {
        var email = (snapshot.val() && snapshot.val().email) || 'Invalid email';
        var dateOfBirth = (snapshot.val() && snapshot.val().dateOfBirth) || 'None';
        var countryCode = (snapshot.val() && snapshot.val().countryCode) || 'None';
        var phoneNumber = (snapshot.val() && snapshot.val().phoneNumber) || 'None';

        $("#logged-in-email").html(email);
        $("#date-of-birth").html(dateOfBirth);
        $("#country-code").html(countryCode);
        $("#phone-number").html(phoneNumber);
    });
}

const actionCodeSettings = {
    // Replace this URL with the URL where the user will complete sign-in.
    url: 'https://login-service-by-ian-pee.web.app/views/home.html',
    handleCodeInApp: true
};

function sendVerificationEmail(email)
{
    auth.sendSignInLinkToEmail(email, actionCodeSettings)
        .then(function ()
        {
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            window.localStorage.setItem('emailForSignIn', email);
            console.log('Verification email sent to ' + email);
        })
        .catch(function (error)
        {
            console.log(error.code);
            // Some error occurred, you can inspect the code: error.code
        });
}

auth.onAuthStateChanged(function (user)
{
    if (user)
    {
        // User is signed in.
        var email = user.email;
        currentUser = user;
        console.log(currentUser.email + " has logged in. ");

        readUserData();
    } else
    {
        // User is signed out.
        if (currentUser != null)
        {
            console.log(currentUser.email + " has logged out. ");
            window.location.assign("../views/index.html");
        }

    }
});
