import { InitialForm } from './types';

type Action = {
    value: string[];
    type: string;
};

export function formReducer(state: InitialForm, action: Action) {
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
                lateSeconds: action.value,
            };
    }
    throw Error('Unknown action occurred.');
}
