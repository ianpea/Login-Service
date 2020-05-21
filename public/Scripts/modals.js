// Put the below html code in any HTML document.
// <div id="modal-popup" class="modal fade" role="dialog"></div>

function redirect(link)
{
    window.location.assign(link);
}

function createModal(header, body, redirectLink, closeButtonText)
{
    document.getElementById("modal-popup")
        .innerHTML =
        `<div class="modal-dialog">
            <!-- content -->
            <div class="modal-content">
                <div class="modal-header">
                    <h4>${header}</h4>
                    <!--<button type="button" class="close" data-dismiss="modal">&times;</button>--!>
                </div>
                <div class="modal-body">
                    <p>${body}</p>
                </div>
                <div class="modal-footer">
                    <div id="button-close">
                        <button id="button-close-modal" type="button" class="btn btn-primary" data-dismiss="modal" onclick="redirect(\'${redirectLink}\')">${closeButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

    $("#modal-popup").modal("show");
}

function createEditModal(header, body, editedField, closeButtonText, errorTextId)
{
    document.getElementById(`modal-popup-${editedField}`)
        .innerHTML =
        `<div class="modal-dialog">
            <!-- content -->
            <div class="modal-content">
                <div class="modal-header">
                    <h4>${header}</h4>
                    <!--<button type="button" class="close" data-dismiss="modal">&times;</button>--!>
                </div>
                <div class="modal-body">
                    ${body}
                    <div class="error" id="${errorTextId}"></div>
                </div>
                <div class="modal-footer">
                    <div id="button-update">
                        <button id="button-update-${editedField}" type="button" class="btn btn-primary">Update
                        </button>
                    </div>
                    <div id="button-close">
                        <button id="button-close-modal" type="button" class="btn btn-danger" data-dismiss="modal">${closeButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

    $(`#modal-popup-${editedField}`).modal("show");
}