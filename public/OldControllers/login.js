var currentUser;
var database = firebase.database();

// Button Listeners
$("#button-sign-in ").click(function ()
{
    email = $("#inputEmail ").val().toString().trim();
    password = $("#inputPassword ").val();
    loginWithEmail(email, password);
    spinnerLoading(this, "Signing In...", null);
});

$("#button-google-login").click(function ()
{
    loginGoogle();
    spinnerLoading(this, "", null);
})

function loginWithEmail(email, password)
{
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error)
    {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        switch (errorCode.toString())
        {
            case "auth/user-not-found":
                $("#error-text").html(`Couldn't find your account`);
                break;
            case "auth/wrong-password":
                $("#error-text").html(`Wrong password`);
                break;
            case "auth/too-many-requests":
                $("#error-text").html(`Too many requests, pleaese come back later`);
                break;
            case "auth/invalid-email":
                $("#error-text").html(`Invalid email`);
                break;
            default:
                document.getElementById("error-text").innerHTML = "";
                break;
        }
        stopSpinnerLoading($("#button-sign-in"), "Sign In");
    });
}

function loginGoogle()
{
    console.log("Logging into Google...");
    var provider = new firebase.auth.GoogleAuthProvider();
    var user;
    firebase.auth().signInWithPopup(provider).then(function (result)
    {
        var token = result.credential.accessToken;
        user = result.user;
    }).then(function ()
    {
        // Check if user exists already, if not, set the user's name and email provided by google
        firebase.database().ref('users/' + user.uid).once("value")
            .then(function (snapshot)
            {
                if (!snapshot.exists())
                {
                    console.log(user.uid);
                    firebase.database().ref('users/' + user.uid).set({
                        email: user.email
                    }).then(function ()
                    {
                        var username = user.providerData[0].displayName.replace(/\s/g, '');
                        console.log("trimmed username: " + username);
                        firebase.database().ref('usernames/' + username).set({
                            uid: user.uid
                        }).then(function ()
                        {
                            console.log("Registered successful for new google user.");
                            window.location.assign("../Views/home.html");
                        });
                    });
                } else
                {
                    window.location.assign("../Views/home.html");
                }
            });
    }).catch(function (error)
    {
        var errorCode = error.code;
        var errorMessage = error.message
        var email = error.email;
        var credential = error.credential

        console.log(errorCode);

        stopSpinnerLoading($("#button-google-login"), `Login with Google 
        <img src="../Content/favicon_google_new.png" width="16" height="16">`)
    });
}

function updatePassword(newPassword)
{
    var newPassword = getASecureRandomPassword();

    user.updatePassword(newPassword).then(function ()
    {
        // Update successful.
    }).catch(function (error)
    {
        // An error happened.
    });
}

firebase.auth().onAuthStateChanged(function (user)
{
    if (user)
    {
        // User is signed in.
        var email = user.email;
        currentUser = user;

        console.log(currentUser.email + " has logged in. ");
        if (currentUser.providerData[0].providerId == "password")
            window.location.assign("../Views/home.html");
    }
    else
    {
        // User is signed out.
        if (currentUser != null)
            console.log(currentUser.email + " has logged out. ");
    }
});