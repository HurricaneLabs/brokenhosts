import { InitialForm } from './types';

type Action = {
    value: string;
    type: string;
};
export function editFormReducer(state: InitialForm, action: Action) {
    console.log('action.type ::: ', action.type);

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
        case 'suppressUntil':
            console.log('UPDATE SUPPRESS UNTIL ', action.value);
            return {
                ...state,
                suppressUntil: action.value,
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
