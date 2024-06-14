export type DataType = {
    type: 'host' | 'sourcetype' | 'index';
};

export type InitialForm = {
    sourcetypes: string | unknown;
    indexes: string | unknown;
    hosts: string | unknown;
};

export type RowsOfData = InitialForm[];

export type SelectedRow = {
    sourcetype: string;
    index: string;
    host: string;
    suppressUntil: string;
};
