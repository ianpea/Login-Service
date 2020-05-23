var usernameRegex = /^[a-zA-Z0-9.!@\-_]{5,30}$/;
// Regex for checking a password between 6 to 20 characters which contain
// at least one numeric digit, one uppercase and one lowercase letter.
var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
// Regex for country code.
var countryCodeRegex = /^(\+?\d{1,3}|\d{1,4})$/;
// Check for is username taken.
var isCheckingUsernameRegex = false;

async function validateUsername(username)
{
    console.log("Checking username...");
    // Then check database if exist or not.
    var isAvailable = false;

    var snapshot = await firebase.database().ref("/usernames/" + username).once("value")
        .then(function (snapshot)
        {
            if (username)
            {
                if (snapshot.exists())
                {
                    $("#username-taken").html("Username already taken").css("color", "red");
                    isAvailable = false;
                    return;
                }
                else
                {
                    $("#username-taken").html("Username can be used").css("color", "green");
                    isAvailable = true;
                }
            }
        }).catch(function (error)
        {
            console.log(error.code);
        });

    if (!isAvailable)
        return;

    // Check for username regex matches or not.
    if (username)
    {
        if (!username.match(usernameRegex))
        {
            $("#username-taken").html("Usernames must be <strong>5-30 characters</strong> long with <strong>no spaces</strong>, and can be made out of <strong>any alphanumerical characters</strong>, including <strong>\"!\", \"@\", \"_\", \"-\".</strong>").css("color", "red");
            return;
        } else
        {
            console.log("BUT WHY HERE THO");
            $("#username-taken").html("Username can be used").css("color", "green");
        }
    } else
    {
        $("#username-taken").html("");
    }

    return isAvailable;
}


function validateCountryCode(countryCode)
{
    // Check if countryCode mataches the regex.
    if (!countryCode.match(countryCodeRegex))
    {
        $("#invalid-country-code").html("Invalid country code, examples: 60, 3, 33...");
        stopSpinnerLoading($("#button-register"), "Register");
        return false;
    } else
    {
        $("#invalid-country-code").html("");
        return true;
    }
}


function validatePassword(password, confirmPassword)
{
    console.log("Checking password...");

    // Check if the password matches the regex.
    if (!password.match(passwordRegex))
    {
        $("#password-not-matching").html(`Password must be between <strong>6 to 20 characters</strong> which contains <strong>no spaces</strong>, and
        at least <strong>1 numeric digit</strong>, <strong>1 uppercase</strong> and <strong>1 lowercase letter</strong>`).css("color", "red");
        return false;
    } else
    {
        $("#password-not-matching").html("");
    }

    var isMatching = false;

    if (confirmPassword)
    {
        if (password == confirmPassword)
        {
            $("#password-not-matching").html("Matching").css("color", "green");
            isMatching = true;
        } else
        {
            $("#password-not-matching").html("Not Matching").css("color", "red");
            isMatching = false;
        }
    } else
    {
        $("#password-not-matching").html("");
    }

    return isMatching;
}