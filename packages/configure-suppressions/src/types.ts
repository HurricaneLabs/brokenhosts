export type DataType = {
    type: 'host' | 'sourcetype' | 'index';
};

export type InitialForm = {
    sourcetypes: string[];
    indexes: string[];
    hosts: string[];
};
