import { RowsOfData } from './types';

type Action = {
    value: any;
    type: string;
};
export function newBatchRecordsFormReducer(state: RowsOfData, action: Action) {
    console.log('action.type ::: ', action.type);
    switch (action.type) {
        case 'batch-create':
            console.log('ALL ', action.value);
            // const arrayOfData = action.value;
            /* [ { sourcetype, host, index, ... } ]
                const { ...allFields } = arrayOfData;
                return {
                    ...state,
                    ...allFields,
                };
            */
            return action.value;
    }
    throw Error('Unknown action occurred.');
}
