type Action = {
    value: string;
    type: string;
};

export function formReducer(fields: string | string[], action: Action) {
    switch (action.type) {
        case 'update-sourcetypes': {
            console.log('UPDATE  SOURCETYPES');
            if (Array.isArray(fields)) {
                return {
                    ...fields,
                    sourcetypes: action.value,
                };
            }
        }
        case 'update-indexes': {
            console.log('UPDATE INDEXES');
            if (Array.isArray(fields)) {
                return {
                    ...fields,
                    sourcetypes: action.value,
                };
            }
        }
        default: {
            throw Error('Unknown action occurred.');
        }
    }
}
