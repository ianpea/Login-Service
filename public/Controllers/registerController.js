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
    window.location.assign("../views/index.html");
});