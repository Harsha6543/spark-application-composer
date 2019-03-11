let objectEditorDialog;
let editObjectForm;
let currentObjectData;
let editObjectSaveFunction;
let editObjectCancelFunction;
let editObjectCloseFunction;

function initializeObjectEditor() {
    // objectEditorDialog = $("#edit-object-form").dialog({
    //     autoOpen: false,
    //     resizable: false,
    //     height: 500,
    //     width: 800,
    //     modal: true,
    //     closeOnEscape: true,
    //     close: handleObjectEditorClose,
    //     buttons: {
    //         'Save': handleObjectEditorSave,
    //         Cancel: handleObjectEditorCancel
    //     }
    // });
    $('#edit-object-form-save').click(handleObjectEditorSave);
    $('#edit-object-form-cancel').click(handleObjectEditorCancel);
    $('#edit-object-form-close').click(handleObjectEditorCancel);
}

function handleObjectEditorClose() {
    if (editObjectCloseFunction) {
        editObjectCloseFunction();
    }
}

function handleObjectEditorSave() {
    // TODO Validate the data against the selected schema
    console.log(JSON.stringify(currentObjectData, null, 4));
    if (editObjectSaveFunction) {
        editObjectSaveFunction(editObjectForm.getValue(), $('#objectEditorSchema').val());
    }
    $('#edit-object-form').modal('hide');
    // objectEditorDialog.dialog('close');
}

function handleObjectEditorCancel() {
    if (editObjectCancelFunction) {
        editObjectCancelFunction();
    }
    $('#edit-object-form').modal('hide');
    // objectEditorDialog.dialog('close');
}

function showObjectEditor(data, schemaName, saveFunction, cancelFunction, closeFunction) {
    if (data && _.isString(data) && data.trim().length > 0) {
        currentObjectData = JSON.parse(data);
    } else if (data && _.isObject(data)) {
        currentObjectData = data;
    }
    editObjectSaveFunction = saveFunction;
    editObjectCancelFunction = cancelFunction;
    editObjectCloseFunction = closeFunction;

    const schema = getSchema(schemaName);
    if (schema) {
        const schemas = $('#objectEditorSchema');
        schemas.val(schemaName);
        schemas.selectmenu('refresh');
        generateForm(schema.schema);
    }
    $('#edit-object-form').modal('show');
    // objectEditorDialog.dialog('open');
}

function generateForm(schema) {
    const form = $('#json-object-editor');
    form.alpaca('destroy');
    form.empty();
    editObjectForm = form.alpaca({
        "schema": schema,
        data: currentObjectData,
        options: generateOptions(schema, { fields: {}})
    });
}

function generateOptions(schema, options) {
    let obj;
    _.forEach(schema.properties, (property, key) => {
        obj = {
            label: key
        };
        switch(property.type) {
            case 'boolean':
                obj.type = 'checkbox';
                break;
            case 'integer':
                obj.type = 'integer';
                break;
            case 'array':
                obj.type = 'array';
                obj.items = { fields: {}};
                generateOptions(schema.properties[key].items, obj.items);
                break;
            case 'object':
                obj.type = 'object';
                break;
            default:
                obj.type = 'text';
                break;
        }
        options.fields[key] = obj;
    });
    return options;
}

function handleSchemaChange() {
    const schema = getSchema($(this).val());
    if (schema) {
        generateForm(schema.schema);
    }
}

function renderSchemaUI() {
    const schemas = $('#objectEditorSchema');
    schemas.empty();
    $('<option value="none">').appendTo(schemas);
    _.forEach(getSchemas(), (schema) => {
        $('<option value="'+ schema.name +'">' + schema.name + '</option>').appendTo(schemas);
    });
    schemas.change(handleSchemaChange);
    // schemas.selectmenu({
    //     change: handleSchemaChange
    // });
}