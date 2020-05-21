$("#button-reset-password").click(function ()
{
    spinnerLoading(this, "", null);
    var email = $("#inputEmail").val().toString().trim()
    sendPasswordResetEmail(email);
})

$("#button-to-login-page").click(function ()
{
    spinnerLoading(this, "", "../Views/index.html");
})
