let searchParams = new URLSearchParams(window.location.search);
const code = searchParams.get('oobCode').toString();

$('#inputPassword, #inputConfirmPassword').on('keyup', function ()
{
    var confirmPassword = $("#inputConfirmPassword").val();
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
    var password = $("#inputPassword ").val();
    var confirmPassword = $("#inputConfirmPassword").val();

    // Regex for checking a password between 6 to 20 characters which contain
    // at least one numeric digit, one uppercase and one lowercase letter.
    var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    // Check if both password and confirmPassword are the same, only continue.
    if (password != confirmPassword)
    {
        createAlert(`Password does not match`);
        return;
    }

    // Check if the password matches the regex.
    if (!password.match(passwordRegex))
    {
        createAlert(`Password must be between <strong>6 to 20</strong> characters which contains
        at least <strong>one numeric digit</strong>, <strong>one uppercase</strong> and <strong>one lowercase letter</strong>`)
        return;
    }

    var newPassword = $("#inputPassword").val().toString();
    spinnerLoading(this, "", null);
    console.log("Confirming..." + newPassword);
    confirm(newPassword);
});

function confirm(newPassword)
{
    firebase.auth().verifyPasswordResetCode(code)
        .then(function (email)
        {
            // Display a "new password" form with the user's email address
            resetEmail = email;
            console.log('Correct code for reset password: ' + resetEmail);

            firebase.auth().confirmPasswordReset(code, newPassword)
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
