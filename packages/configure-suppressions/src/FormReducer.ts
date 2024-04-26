import { InitialForm } from './types';

type Action = {
    value: string;
    type: string;
};

export function formReducer(state: InitialForm, action: Action) {
    switch (action.type) {
        case 'sourcetype':
            console.log('UPDATE  SOURCETYPES ', action.value);
            return {
                ...state,
                sourcetype: action.value,
            };
        case 'index':
            console.log('UPDATE INDEXES ', action.value);
            return {
                ...state,
                index: action.value,
            };
        case 'host':
            console.log('UPDATE HOSTS ', action.value);
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
        case 'comment':
            console.log('COMMENT ', action.value);
            return {
                ...state,
                comment: action.value,
            };
        case 'contact':
            console.log('CONTACT ', action.value);
            return {
                ...state,
                contact: action.value,
            };
    }
    throw Error('Unknown action occurred.');
}
