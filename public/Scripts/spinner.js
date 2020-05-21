function spinnerLoading(buttonPressed, loadingText = "", redirectLink)
{
    $(buttonPressed).prop("disabled", true);
    $(buttonPressed).html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden = "true"></span > ${loadingText}`);

    if (redirectLink != null)
        window.location.assign(redirectLink);
}

function stopSpinnerLoading(buttonPressed, defaultText)
{
    $(buttonPressed).prop("disabled", false);
    $(buttonPressed).html(defaultText);
}