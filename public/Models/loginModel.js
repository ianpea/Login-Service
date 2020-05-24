// User infos
var currentUser;
var email;
var password;

// Firebase
var database = firebase.database();
var auth = firebase.auth();

// Methods

function loginWithEmail(email, password)
{
    console.log("Signing in with email: " + email + "...");
    spinnerLoading($("#button-sign-in "), "Signing In...", null);
    auth.signInWithEmailAndPassword(email, password).catch(function (error)
    {
        // Handle Errors here.
        var errorCode = error.code;

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
    spinnerLoading($("#button-google-login"), "", null);

    var provider = new firebase.auth.GoogleAuthProvider();
    var user;

    auth.signInWithPopup(provider).then(function (result)
    {
        var token = result.credential.accessToken;
        user = result.user;
    }).then(function ()
    {
        // Check if user exists already, if not, set the user's name and email provided by google
        database.ref('users/' + user.uid).once("value")
            .then(function (snapshot)
            {
                if (!snapshot.exists())
                {
                    console.log(user.uid);
                    database().ref('users/' + user.uid).set({
                        email: user.email
                    }).then(function ()
                    {
                        var username = user.providerData[0].displayName.replace(/\s/g, '');
                        console.log("trimmed username: " + username);
                        database().ref('usernames/' + username).set({
                            uid: user.uid
                        }).then(function ()
                        {
                            console.log("Registered successful for new google user.");
                            window.location.assign("../views/home.html");
                        });
                    });
                } else
                {
                    window.location.assign("../views/home.html");
                }
            });
    }).catch(function (error)
    {
        var errorCode = error.code;
        console.log(errorCode);

        stopSpinnerLoading($("#button-google-login"), `Login with Google 
        <img src="../Content/favicon_google_new.png" width="16" height="16">`)
    });
}

auth.onAuthStateChanged(function (user)
{
    if (user)
    {
        // User is signed in.
        email = user.email;
        currentUser = user;
        console.log(currentUser.email + " has logged in. ");

        // If provider is "password", then redirect to home.html.
        // Else if provider is not password, e.g. "google", redirect in its 
        // related method, e.g. "loginGoogle()";
        if (currentUser.providerData[0].providerId == "password")
            window.location.assign("../views/home.html");
    }
    else
    {
        // User is signed out.
        if (currentUser != null)
            console.log(currentUser.email + " has logged out. ");
    }
});