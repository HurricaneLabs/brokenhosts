import { InitialForm, SelectedRow } from './types';

type Action = {
    value: any[] | string;
    type: string;
};
export function editFormReducer(state: InitialForm, action: Action) {
    switch (action.type) {
        case 'sourcetype':
            console.log('UPDATE  SOURCETYPE ', action.value);
            return {
                ...state,
                sourcetype: action.value,
            };
        case 'index':
            console.log('UPDATE INDEX ', action.value);
            return {
                ...state,
                index: action.value,
            };
        case 'host':
            console.log('UPDATE HOST ', action.value);
            return {
                ...state,
                host: action.value,
            };
        case 'lateSecs':
            console.log('LATE SECONDS ', action.value);
            return {
                ...state,
                lateSecs: action.value,
            };
        case 'comments':
            console.log('COMMENTS ', action.value);
            return {
                ...state,
                comments: action.value,
            };
        case 'contacts':
            console.log('CONTACTS ', action.value);
            return {
                ...state,
                contacts: action.value,
            };
        case 'all':
            console.log('ALL ', action.value[0]);
            const form = action.value[0];
            const { ...allFields } = form;
            return {
                ...state,
                ...allFields,
            };
    }
    throw Error('Unknown action occurred.');
}
