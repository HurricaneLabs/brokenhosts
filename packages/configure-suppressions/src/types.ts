export type DataType = {
    type: 'host' | 'sourcetype' | 'index';
};

export type InitialForm = {
    sourcetype: string;
    index: string;
    host: string;
};
