function createAlert(alertText)
{
    document.getElementById("error-span").innerHTML = `
    <div class="container alert alert-danger alert-dismissible fade show error" role="alert">
        <span class="error" id="error-text"> ${alertText}</span>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`;
}