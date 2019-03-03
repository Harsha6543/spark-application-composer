let newDialog;
let newSaveFunction;
let newCancelFunction;

function initializeNewDialog() {
    newDialog = $("#dialog-new-form").dialog({
        autoOpen: false,
        height: 'auto',
        width: 350,
        modal: true,
        buttons: {
            "Save": handleNewDialogSave,
            Cancel: handleNewDialogCancel
        }
    });
}

function handleNewDialogSave() {
    if (newSaveFunction) {
        newSaveFunction($('#add-new-id').val());
    }
    newDialog.dialog('close');
}

function handleNewDialogCancel() {
    if (newCancelFunction) {
        newCancelFunction();
    }
    newDialog.dialog('close');
}

function showNewDialog(saveFunction, cancelFunction) {
    newSaveFunction = saveFunction;
    newCancelFunction = cancelFunction;
    $('#add-new-id').val('');
    newDialog.dialog('open');
}
