$('#inputPassword, #inputConfirmPassword').on('keyup', function ()
{
    confirmPassword = $("#inputConfirmPassword").val();
    if (confirmPassword)
    {
        if ($('#inputPassword').val() == $('#inputConfirmPassword').val())
        {
            $('#password-not-matching').html('Matching').css('color', 'green');
        } else
        {
            $('#password-not-matching').html('Not Matching').css('color', 'red');
            return;
        }
    } else
    {
        $('#password-not-matching').html('');
    }
});

$("#button-confirm-password").click(function ()
{
    password = $("#inputPassword ").val();
    confirmPassword = $("#inputConfirmPassword").val();

    confirm(confirmPassword);
});
