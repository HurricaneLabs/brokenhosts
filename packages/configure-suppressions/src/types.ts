export type DataType = {
    type: 'host' | 'sourcetype' | 'index';
};

export type InitialForm = {
    sourcetype: string | unknown;
    index: string | unknown;
    host: string | unknown;
};

export type RowsOfData = InitialForm[];

export type SelectedRow = {
    sourcetype: string;
    index: string;
    host: string;
    suppressUntil: string;
};
