import { InitialForm } from './types';

type Action = {
    value: string[];
    type: string;
};

export function formReducer(state: InitialForm, action: Action) {
    switch (action.type) {
        case 'update-sourcetypes':
            console.log('UPDATE  SOURCETYPES ', action.value);
            return {
                ...state,
                sourcetypes: action.value,
            };
        case 'update-indexes':
            console.log('UPDATE INDEXES ', action.value);
            return {
                ...state,
                indexes: action.value,
            };
        case 'update-hosts':
            console.log('UPDATE HOSTS ', action.value);
            return {
                ...state,
                hosts: action.value,
            };
    }
    throw Error('Unknown action occurred.');
}
