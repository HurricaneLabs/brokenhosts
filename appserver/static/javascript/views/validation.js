"use strict";

export async function check(state) {

    let hasErrors  = false;

    function checkIfEmpty(field) {
        let currentFieldValue = state.form[field];
        if (currentFieldValue === '') {
            hasErrors = true; 
            return true;
        }
        return false;
    }

    function checkIfNonBoolean(field) {
        let currentFieldValue = state.form[field];
        if (typeof currentFieldValue !== 'boolean') {
            hasErrors = true; 
            return true;
        }
        return false;
    }

    function checkIfNonNumeric(field) {
        let currentFieldValue = state.form[field];
        return !/^(-|)\d+$/.test(currentFieldValue);
    }

    function checkIfOutOfRange(field) {
        let currentFieldValue = state.form[field];
        if (parseInt(currentFieldValue) < 1) {
            hasErrors = true; 
            return true;
        }
        return false;
    }

    // Yay generators
    function* entries(obj) {
        for (let key of Object.keys(obj)) {
          yield [key, obj[key]];
        }
     }

    for (let [key, value] of entries(state.form.validation)) {
        let field = key;

        for (let [validation_type, is_error] of entries(value)) {
            switch(validation_type) {
                case ('empty'):
                    is_error = checkIfEmpty(field);
                    break;
                case ('non_numeric'):
                    is_error = checkIfNonNumeric(field);
                    break;
                case ('out_of_range'):
                    is_error = checkIfOutOfRange(field);
                    break;
                case ('non_boolean'):
                    is_error = checkIfNonBoolean(field);
                    break;
                default:
                    console.error(`Could not find a matching field type. Provided ${validation_type}.`);
                    break;
            }
            value[validation_type] = is_error;
        }

    }

    return {
        errors: hasErrors,
        original: { ...state }
    }

}
