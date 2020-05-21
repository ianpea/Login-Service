$("#button-reset-password").click(function ()
{
    spinnerLoading(this, "", null);
    email = $("#inputEmail").val().toString().trim()
    sendPasswordResetEmail(email);
})

$("#button-to-login-page").click(function ()
{
    spinnerLoading(this, "", "../Views/index.html");
})

function sendPasswordResetEmail(email)
{
    console.log("Password reset email sent to " + email);
    firebase.auth().sendPasswordResetEmail(email).then(function ()
    {
        createModal(
            "Status",
            "Password reset email have been sent to <b>" + email + "</b>",
            "../Views/index.html",
            "Return to Login"
        )
    }).catch(function (error)
    {
        stopSpinnerLoading($("#button-reset-password"), "Send Password Reset Email");

        switch (error.code)
        {
            case "auth/invalid-email":
                $("#error-text").html("Invalid email");
                break;
            case "auth/user-not-found":
                $("#error-text").html("Email not found");
                break;
            default:
                break;
        }
    });
};
