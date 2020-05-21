// Button Listeners
$("#button-sign-in ").click(function ()
{
    email = $("#inputEmail ").val().toString().trim();
    password = $("#inputPassword ").val();
    loginWithEmail(email, password);
});

$("#button-google-login").click(function ()
{
    loginGoogle();
})
