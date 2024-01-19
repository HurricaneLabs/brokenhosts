import React, { Component } from 'react';
import { cloneDeep } from 'lodash';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';
import Table, { TableRequestMoveRowHandler } from '@splunk/react-ui/Table';
import { createRESTURL } from '@splunk/splunk-utils/url';
import * as config from '@splunk/splunk-utils/config';
import Button from '@splunk/react-ui/Button';
import Pencil from '@splunk/react-icons/Pencil';
import Tooltip from '@splunk/react-ui/Tooltip';
import { handleError, handleResponse, defaultFetchInit } from '@splunk/splunk-utils/fetch';
import EditEntry from './EditEntry';
import NewEntry from './NewEntry';

interface Row {
    _key: string;
    comments: string;
    contact: string;
    email: string;
    index: string;
    sourcetype: string;
    host: string;
    lateSecs: string;
}

interface Header {
    key: string;
    label: string;
}

interface TableState {
    data: Row[];
    headers: Header[];
    openEditModal: boolean;
    openNewModal: boolean;
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

    return n;
}

async function updateRecord(key, value) {
    // update the KV record for the key that is selected

    const fetchInit = defaultFetchInit;
    fetchInit.method = 'POST';
    const n = await fetch(`${kvUrl}/${key}`, {
        ...fetchInit,
        headers: {
            'X-Splunk-Form-Key': config.CSRFToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
    })
        .then(handleResponse(200))
        .catch(handleError('error'))
        .catch((err) => (err instanceof Object ? 'error' : err)); // handleError sometimes returns an Object;
    return n;
}

async function addNewRecord() {
    // delete the KV record for the key that is selected

    const fetchInit = defaultFetchInit;
    fetchInit.method = 'POST';
    const updatedData = await fetch(
        `/servicesNS/nobody/${config.app}/storage/collections/data/expectedTime/`,
        {
            ...fetchInit,
            headers: {
                'X-Splunk-Form-Key': config.CSRFToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(''),
        }
    )
        .then(handleResponse(200))
        .catch(() => {
            handleError('error');
        });

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
                { label: 'Contact', key: 'contact' },
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
            selected: {
                _key: '',
                comments: '',
                contact: '',
                email: '',
                index: '',
                sourcetype: '',
                host: '',
                lateSecs: '',
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

    handleNewRequestOpen = (e, data) => {
        // handles what happens when modal is open
        this.setState({
            openNewModal: true,
        });
    };

    handleEditRequestOpen = (e, data) => {
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
        // modalToggle?.current?.focus(); // Must return focus to the invoking element when the modal closes
    };

    handleRequestNewClose = () => {
        // handles what happens when modal is closed
        this.setState({
            openNewModal: false,
        });
        // modalToggle?.current?.focus(); // Must return focus to the invoking element when the modal closes
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

    handleRequestMoveRow: TableRequestMoveRowHandler = ({ fromIndex, toIndex }) => {
        this.setState((state) => {
            const data = cloneDeep(state.data);
            const rowToMove = data[fromIndex];

            const insertionIndex = toIndex < fromIndex ? toIndex : toIndex + 1;
            data.splice(insertionIndex, 0, rowToMove);

            const removalIndex = toIndex < fromIndex ? fromIndex + 1 : fromIndex;
            data.splice(removalIndex, 1);

            return { data };
        });
    };

    handleAdditionalRecord = () => {
        console.log('TO DO!');
    };

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
                            label="Add Data"
                            appearance="primary"
                            onClick={this.handleNewRequestOpen}
                        />
                    </div>
                    <div>
                        <Table stripeRows onRequestMoveRow={this.handleRequestMoveRow}>
                            <Table.Head>
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
                        <EditEntry
                            remove={deleteRecord}
                            update={updateRecord}
                            openState={this.state.openEditModal}
                            onClose={this.handleRequestEditClose}
                            selectedRow={this.state.selected}
                        />
                        <NewEntry
                            openState={this.state.openNewModal}
                            onClose={this.handleRequestNewClose}
                            onSubmit={addNewRecord}
                        />
                    </div>
                </SplunkThemeProvider>
            </>
        );
    }
}
