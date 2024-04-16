export type DataType = {
    type: 'host' | 'sourcetype' | 'index';
};

export type InitialForm = {
    sourcetypes: string[];
    indexes: string[];
    hosts: string[];
};

export type SelectedRow = {
    sourcetype: string;
    index: string;
    host: string;
    lateSecs: string;
    contact: string;
    comments: string;
};
