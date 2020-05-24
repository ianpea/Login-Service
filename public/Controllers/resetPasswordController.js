$("#inputPassword, #inputConfirmPassword").on('keyup', function ()
{
    validatePassword($("#inputPassword").val(), $("#inputConfirmPassword").val());
});
$("#button-confirm-password").click(function ()
{
    password = $("#inputPassword ").val();
    confirmPassword = $("#inputConfirmPassword").val();

    spinnerLoading(this, "", null);
    confirm(password, confirmPassword);
});