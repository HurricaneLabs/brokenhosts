import { InitialForm } from './types';

type Action = {
    value: any[] | string;
    type: string;
};
export function newFormReducer(state: InitialForm, action: Action) {
    switch (action.type) {
        case 'sourcetypes':
            console.log('UPDATE  SOURCETYPES ', action.value);
            return {
                ...state,
                sourcetypes: action.value,
            };
        case 'indexes':
            console.log('UPDATE INDEXES ', action.value);
            return {
                ...state,
                indexes: action.value,
            };
        case 'hosts':
            console.log('UPDATE HOSTS ', action.value);
            return {
                ...state,
                hosts: action.value,
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
