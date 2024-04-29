import React, { Component } from 'react';
import { cloneDeep, find, update } from 'lodash';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';
import Table, {
    TableRequestMoveRowHandler,
    RowClickHandler,
    RowRequestToggleHandler,
} from '@splunk/react-ui/Table';
import { createRESTURL } from '@splunk/splunk-utils/url';
import * as config from '@splunk/splunk-utils/config';
import Button from '@splunk/react-ui/Button';
import Pencil from '@splunk/react-icons/Pencil';
import Tooltip from '@splunk/react-ui/Tooltip';
import { handleError, handleResponse, defaultFetchInit } from '@splunk/splunk-utils/fetch';
import EditRecord from './EditRecord';
import NewRecord from './NewRecord';
import NewBatchRecords from './NewBatchRecords';
import ConfirmRemoveSelected from './ConfirmRemoveSelected';
import SearchJob from '@splunk/search-job';
import { keysToOmit } from './Searches';

interface Row {
    _key: string;
    comments: string;
    contact: string;
    email: string;
    index: string;
    sourcetype: string;
    host: string;
    lateSecs: string;
    selected: boolean;
    disabled: boolean;
}

interface Header {
    key: string;
    label: string;
}

interface TableState {
    data: Row[];
    activeRow?: string;
    activeRowData?: string;
    headers: Header[];
    openEditModal: boolean;
    openNewModal: boolean;
    openNewBatchModal: boolean;
    openConfirmRemoveModal: boolean;
    selected: Row;
    initialFetch: boolean;
}

type TableData = {
    _key: '';
    comments: '';
    contact: '';
    index: '';
    sourcetype: '';
    host: '';
    lateSecs: '';
};

const themeToVariant = {
    prisma: { colorScheme: 'light', family: 'prisma' },
};

const kvUrl = createRESTURL(`storage/collections/data/expectedTime`, {
    app: config.app,
    sharing: 'app',
});

const kvBatchUrl = createRESTURL(`storage/collections/data/expectedTime/batch_save`, {
    app: config.app,
    sharing: 'app',
});

const defaultDataUrl = createRESTURL(`/servicesNS/nobody/${config.app}/bhosts/bhosts_setup/setup`, {
    app: config.app,
    sharing: 'app',
});

const buttonStyle = {
    padding: '10px',
};

async function populateTableWithDefaultData() {
    // read in theKV store collection of interest

    const fetchInit = defaultFetchInit; // from splunk-utils API
    fetchInit.method = 'POST';
    const n = await fetch(defaultDataUrl, {
        ...fetchInit,
        headers: {
            'X-Splunk-Form-Key': config.CSRFToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
        body: null,
    })
        .then(handleResponse(200))
        .catch(handleError('error'))
        .catch((err) => (err instanceof Object ? 'error' : err)); // handleError sometimes returns an Object;

    console.log('set with default values ::: ', n);

    return n;
}

async function readCollection() {
    // read in theKV store collection of interest

    const fetchInit = defaultFetchInit; // from splunk-utils API
    fetchInit.method = 'GET';
    const n = await fetch(kvUrl, {
        ...fetchInit,
        headers: {
            'X-Splunk-Form-Key': config.CSRFToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
    })
        .then(handleResponse(200))
        .catch(handleError('error'))
        .catch((err) => (err instanceof Object ? 'error' : err)); // handleError sometimes returns an Object;

    return n.map((item) => {
        item.disabled = false;
        item.selected = false;
        return item;
    });
}

async function addNewRecord(record) {
    // delete the KV record for the key that is selected

    const fetchInit = defaultFetchInit;
    fetchInit.method = 'POST';

    const updatedData = await fetch(kvUrl, {
        ...fetchInit,
        headers: {
            'X-Splunk-Form-Key': config.CSRFToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
    })
        .then(handleResponse(200))
        .catch(() => {
            handleError('error');
        });

    return updatedData;
}

async function addNewRecords(records: any[]) {
    // delete the KV record for the key that is selected

    console.log('addNewRecords: ', records);

    const fetchInit = defaultFetchInit;
    fetchInit.method = 'POST';

    const updatedData = await fetch(kvBatchUrl, {
        ...fetchInit,
        headers: {
            'X-Splunk-Form-Key': config.CSRFToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(records),
    })
        .then(handleResponse(200))
        .catch(() => {
            handleError('error');
        });

    // this.setState((prevState) => ({
    //     data: [...prevState.data, ...records],
    // }));

    return updatedData;
}

async function deleteRecord(key) {
    // delete the KV record for the key that is selected

    const fetchInit = defaultFetchInit;
    fetchInit.method = 'DELETE';
    const n = await fetch(`${kvUrl}/${key}`, {
        ...fetchInit,
        headers: {
            'X-Splunk-Form-Key': config.CSRFToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
    })
        .then(handleResponse(200))
        .catch(() => {
            handleError('error');
        });

    return n;
}

export default class ReorderRows extends Component<{}, TableState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            headers: [
                { label: 'Comments', key: 'comments' },
                { label: 'contact', key: 'contact' },
                { label: 'Email', key: 'email' },
                { label: 'Index', key: 'index' },
                { label: 'Sourcetype', key: 'sourcetype' },
                { label: 'Host', key: 'host' },
                { label: 'Late Seconds', key: 'lateSecs' },
            ],
            data: [],
            initialFetch: false,
            openEditModal: false,
            openNewModal: false,
            openNewBatchModal: false,
            openConfirmRemoveModal: false,
            selected: {
                _key: '',
                comments: '',
                contact: '',
                email: '',
                index: '',
                sourcetype: '',
                host: '',
                lateSecs: '',
                selected: false,
                disabled: false,
            },
        };
    }

    componentWillMount() {
        readCollection().then((data) =>
            this.setState({
                data,
                initialFetch: true,
            })
        );
    }

    // interface Row {
    //     _key: string;
    //     comments: string;
    //     contact: string;
    //     email: string;
    //     index: string;
    //     sourcetype: string;
    //     host: string;
    //     lateSecs: string;
    //     selected: boolean;
    //     disabled: boolean;
    // }

    updateSelectedRecord = async (updatedData) => {
        Object.assign(updatedData, { _key: this.state.selected._key });
        console.log('updated row data ::: ', updatedData);
        console.log('selected row to update ::: ', this.state.selected);

        this.setState((prevState) => ({
            data: prevState.data.map((row) => {
                if (row._key === this.state.selected._key) {
                    const {
                        comments,
                        contact,
                        email,
                        index,
                        sourcetype,
                        host,
                        lateSecs,
                        selected,
                        disabled,
                    } = updatedData;

                    console.log('updatedData ::: ', updatedData);

                    return {
                        _key: row._key,
                        comments,
                        contact,
                        email,
                        index,
                        sourcetype,
                        host,
                        lateSecs,
                        selected,
                        disabled,
                    } as Row;
                }
                return row;
            }),
        }));

        const fetchInit = defaultFetchInit;
        fetchInit.method = 'POST';
        const n = await fetch(`${kvUrl}/${this.state.selected._key}`, {
            ...fetchInit,
            headers: {
                'X-Splunk-Form-Key': config.CSRFToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
            .then(handleResponse(200))
            .catch(handleError('error'))
            .catch((err) => (err instanceof Object ? 'error' : err)); // handleError sometimes returns an Object;
        return n;
    };

    addNewRow = async (row) => {
        await addNewRecord(row);
        // this.setState((prevState) => ({
        //     data: [...prevState.data, row],
        // }));
        readCollection().then((data) =>
            this.setState({
                data,
                initialFetch: true,
            })
        );
    };

    addNewRows = async (rows: any[]) => {
        await addNewRecords(rows);
        // this.setState((prevState) => ({
        //     data: [...prevState.data, ...rows],
        // }));
        readCollection().then((data) =>
            this.setState({
                data,
                initialFetch: true,
            })
        );
    };

    removeSelectedRecords = () => {
        console.log(
            'selected rows to remove ::: ',
            this.state.data.filter((row) => row.selected)
        );

        console.log('row count before ::: ', this.state.data.length);

        const _keysOfRows = this.state.data.filter((row) => row.selected).map((row) => row._key);

        console.log('_keysOfRows ::: ', _keysOfRows);
        console.log(
            'post filtered rows ::: ',
            this.state.data.filter((row) => !_keysOfRows.includes(row._key))
        );

        this.setState((prevState) => ({
            data: prevState.data.filter((row) => !_keysOfRows.includes(row._key)),
        }));

        // If more than one row has been selected for removal we will do a batch update
        // to the collection
        if (_keysOfRows.length > 1) {
            const keys = keysToOmit(_keysOfRows);

            console.log(`
                | inputlookup expectedTime 
                | eval k=_key 
                | fields k, * 
                | search ${keys}
                | outputlookup expectedTime
            `);

            const keysToRemoveSearch = SearchJob.create({
                search: `
                    | inputlookup expectedTime 
                    | eval k=_key 
                    | fields k, * 
                    | search ${keys}
                    | outputlookup expectedTime
                `,
                earliest_time: '-1m',
                latest_time: 'now',
            });

            keysToRemoveSearch.getProgress().subscribe({
                next: (response) => {
                    console.log('keysToRemove response ::: ', response);
                },
                complete: () => {
                    console.log('keysToRemove done');
                },
            });
        } else {
            deleteRecord(_keysOfRows[0]);
        }
    };

    handleNewRequestOpen = () => {
        // handles what happens when modal is open
        this.setState({
            openNewModal: true,
        });
    };

    handleNewBatchRequestOpen = () => {
        // handles what happens when modal is open
        this.setState({
            openNewBatchModal: true,
        });
    };

    handleRemoveRequestOpen = () => {
        // handles what happens when modal is open
        this.setState({
            openConfirmRemoveModal: true,
        });
    };

    handleEditRequestOpen = (_, data) => {
        console.log('selected data ::: ', data);
        // handles what happens when modal is open
        this.setState({
            openEditModal: true,
            selected: data,
        });
    };

    handleRequestEditClose = () => {
        // handles what happens when modal is closed
        this.setState({
            openEditModal: false,
        });
    };

    handleRequestNewClose = () => {
        // handles what happens when modal is closed
        this.setState({
            openNewModal: false,
        });
    };

    handleRequestNewBatchClose = () => {
        // handles what happens when modal is closed
        this.setState({
            openNewBatchModal: false,
        });
    };

    handleRequestConfirmRemoveClose = () => {
        this.setState({
            openConfirmRemoveModal: false,
        });
    };

    handleDefaultDataPull = () => {
        populateTableWithDefaultData().then(() => {
            readCollection().then((data) =>
                this.setState({
                    data,
                })
            );
        });
    };

    handleToggle: RowRequestToggleHandler = (_, { index, sourcetype, host, lateSecs, contact }) => {
        this.setState((state) => {
            const data = cloneDeep(state.data);

            const selectedRow = find(data, { index, sourcetype, host, lateSecs, contact });
            if (selectedRow) {
                selectedRow.selected = !selectedRow.selected;
                return { data };
            }
            return null;
        });
    };

    handleRowClick: RowClickHandler = (_, data) => {
        console.log('handleRowClick!!!! ', data);
        this.setState({ activeRow: data.name, activeRowData: JSON.stringify(data) });
    };

    // eslint-disable-next-line class-methods-use-this
    rowSelectionState(data: Row[]) {
        const selectedCount = data.reduce(
            (count, { selected }) => (selected ? count + 1 : count),
            0
        );
        const disabledCount = data.reduce(
            (count, { disabled }) => (disabled ? count + 1 : count),
            0
        );

        if (selectedCount === 0) {
            return 'none';
        }
        if (selectedCount + disabledCount === data.length) {
            return 'all';
        }
        return 'some';
    }

    render() {
        const { headers, data } = this.state;

        const primaryActions = // adding row actions to our table
            (
                <Tooltip
                    content={_('Edit')}
                    contentRelationship="label"
                    onClick={this.handleEditRequestOpen}
                    style={{ marginRight: 8 }}
                >
                    <Button appearance="secondary" icon={<Pencil hideDefaultTooltip />} />
                </Tooltip>
            );

        return (
            <>
                <SplunkThemeProvider {...themeToVariant.prisma}>
                    <div style={buttonStyle}>
                        {data.length == 0 && this.state.initialFetch && (
                            <Button
                                label="Populate with Default Values"
                                appearance="primary"
                                onClick={this.handleDefaultDataPull}
                            />
                        )}
                        <Button
                            label="Add New Entry"
                            appearance="primary"
                            onClick={this.handleNewRequestOpen}
                        />
                        <Button
                            label="Add Multiple Entries"
                            appearance="primary"
                            onClick={this.handleNewBatchRequestOpen}
                        />
                        {this.state.data.filter((row) => row.selected).length > 0 ? (
                            <Button
                                label="Remove Selected"
                                appearance="default"
                                onClick={this.handleRemoveRequestOpen}
                            />
                        ) : (
                            ''
                        )}
                    </div>
                    <div>
                        <Table stripeRows rowSelection={this.rowSelectionState(data)}>
                            <Table.Head>
                                <Table.HeadCell></Table.HeadCell>
                                {headers.map((header) => (
                                    <Table.HeadCell key={header.key}>{header.label}</Table.HeadCell>
                                ))}
                                <Table.HeadCell key="edit">Edit</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {data.map((row) => (
                                    <Table.Row
                                        key={row._key}
                                        data={row}
                                        actionPrimary={primaryActions}
                                        onRequestToggle={this.handleToggle}
                                        onClick={row.disabled ? undefined : this.handleRowClick}
                                        selected={row.selected}
                                        disabled={row.disabled}
                                    >
                                        <Table.Cell>{row.comments}</Table.Cell>
                                        <Table.Cell>{row.contact}</Table.Cell>
                                        <Table.Cell>{row.email}</Table.Cell>
                                        <Table.Cell>{row.index}</Table.Cell>
                                        <Table.Cell>{row.sourcetype}</Table.Cell>
                                        <Table.Cell>{row.host}</Table.Cell>
                                        <Table.Cell>{row.lateSecs}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <EditRecord
                            onUpdate={this.updateSelectedRecord}
                            openState={this.state.openEditModal}
                            onClose={this.handleRequestEditClose}
                            selectedRowData={this.state.selected}
                        />
                        <NewRecord
                            openState={this.state.openNewModal}
                            onClose={this.handleRequestNewClose}
                            onSubmit={this.addNewRow}
                        />
                        <NewBatchRecords
                            openState={this.state.openNewBatchModal}
                            onClose={this.handleRequestNewBatchClose}
                            onSubmit={this.addNewRows}
                        />
                        <ConfirmRemoveSelected
                            openState={this.state.openConfirmRemoveModal}
                            onClose={this.handleRequestConfirmRemoveClose}
                            selectedRows={this.state.data.filter((row) =>
                                row.selected ? row : false
                            )}
                            confirmRemoval={this.removeSelectedRecords}
                        />
                    </div>
                </SplunkThemeProvider>
            </>
        );
    }
}
