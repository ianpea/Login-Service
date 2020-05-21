// Code for reset email from redirected URL
let searchParams = new URLSearchParams(window.location.search);
const code = searchParams.get('oobCode').toString();

// User info
var password, confirmPasswordReset;

// Firebase
var auth = firebase.auth();


function confirm(newPassword, newConfirmPassword)
{
    spinnerLoading($("#button-confirm-password"), "", null);
    if (!validatePassword(newPassword, newConfirmPassword))
    {
        console.log("Password not allowed.");
        stopSpinnerLoading($("#button-confirm-password"), "Confirm");
        return;
    }

    auth.verifyPasswordResetCode(code)
        .then(function (email)
        {
            // Display a "new password" form with the user's email address
            resetEmail = email;

            auth.confirmPasswordReset(code, newPassword)
                .then(function ()
                {
                    console.log('Password reset successful for email: ' + resetEmail + " " + newPassword);
                    createModal(
                        "Status",
                        "Password reset successful for email <b>" + resetEmail + "</b>",
                        "../Views/index.html",
                        "Return to Login");
                }).catch(function (error)
                {
                    console.log(error);
                })
        })
        .catch(function (error)
        {
            // Invalid code
            console.log(error);
        })
}
