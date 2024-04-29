import React from 'react';
import FormRows from '@splunk/react-ui/FormRows';
import { createDOMID } from '@splunk/ui-utils/id';
import Text from '@splunk/react-ui/Text';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import TextArea from '@splunk/react-ui/TextArea';
import { epochNow } from './Helpers.ts';
import DatasourceSelect from './formFields/DatasourceSelect.tsx';
import Heading from '@splunk/react-ui/Heading';
import Tooltip from '@splunk/react-ui/Tooltip';
import P from '@splunk/react-ui/Paragraph';

interface Item {
    sourcetypes: string;
    indexes: string;
    hosts: string;
    lateSeconds: unknown | string;
    contact: unknown | string;
    comments: unknown | string;
}

interface Form {
    items: any[];
}

interface Props {
    onClose: () => void;
    onSubmit: (f: any[]) => Promise<void | Response>;
    dispatchForm: () => {};
    form: Form;
    openState: boolean;
}

interface State {
    items: any[];
    itemsValue: any[];
}

const sourcetypeUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const indexUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const hostUrl = `storage/collections/data/bh_host_cache?query={"last_seen":{"$gt":${epochNow}}}`;

class NewBatchRecords extends React.PureComponent<Props, State> {
    constructor(props) {
        super(props);

        const items = [];

        this.state = {
            items,
            itemsValue: [],
        };
    }

    submitData = () => {
        console.log('FORM ??? ', this.state.itemsValue);
        this.props.onSubmit(this.state.itemsValue);
        this.props.onClose();
    };

    handleFormChange = (type: string, value: string, index?: number | undefined): void => {
        console.log('current value ::: ', type, value, index);
        const currentItemsValueArray = this.state.itemsValue;
        if (index !== undefined) {
            currentItemsValueArray[index][type] = value;
            console.log('currentItemsValueArray ::: ', currentItemsValueArray);
            this.setState((_) => {
                itemsValue: currentItemsValueArray;
            });
        }
    };

    handleRequestAdd = () => {
        const newValue = {};

        console.log('handleRequestAdd');

        console.log('this.state.itemsValue before', this.state.itemsValue);

        const updatedItemsValues = [...this.state.itemsValue, { newValue }];

        console.log('this.state.itemsValue after', this.state.itemsValue);

        this.setState({ itemsValue: updatedItemsValues });

        this.setState((state) => ({
            items: FormRows.addRow(
                <FormRows.Row
                    index={state.items.length}
                    key={createDOMID()}
                    onRequestRemove={this.handleRequestRemove}
                >
                    <Heading level={5}>New Entry</Heading>
                    <div style={{ display: 'flex' }}>
                        <ControlGroup
                            label="Index"
                            labelPosition="top"
                            style={{ margin: '.5em .25em 0 0', flexGrow: '1' }}
                        >
                            <DatasourceSelect
                                type="index"
                                url={indexUrl}
                                setValue={this.handleFormChange}
                                index={state.items.length}
                                value={state.itemsValue[state.itemsValue.length - 1]['index']}
                            />
                        </ControlGroup>
                        <ControlGroup
                            label="Sourcetype"
                            labelPosition="top"
                            style={{ margin: '.5em .25em 0 0', flexGrow: '1' }}
                        >
                            <DatasourceSelect
                                type="sourcetype"
                                url={indexUrl}
                                setValue={this.handleFormChange}
                                index={state.items.length}
                                value={state.itemsValue[state.itemsValue.length - 1]['sourcetype']}
                            />
                        </ControlGroup>
                        <ControlGroup
                            label="Host"
                            labelPosition="top"
                            style={{ margin: '.5em .25em 0 0', flexGrow: '1' }}
                        >
                            <DatasourceSelect
                                type="host"
                                url={hostUrl}
                                setValue={this.handleFormChange}
                                index={state.items.length}
                                value={state.itemsValue[state.itemsValue.length - 1]['host']}
                            />
                        </ControlGroup>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <ControlGroup
                            label="Late Seconds"
                            labelPosition="top"
                            style={{ margin: '.5em .25em 0 0', flexGrow: '1' }}
                        >
                            <Text
                                style={{ margin: '0 .25em 0 0' }}
                                defaultValue="Late Seconds"
                                describedBy="header-lateSecs"
                                value={state.itemsValue[state.itemsValue.length - 1]['lateSecs']}
                                onChange={(e) =>
                                    this.handleFormChange(
                                        'lateSecs',
                                        (e.target as HTMLInputElement).value,
                                        state.itemsValue.length - 1
                                    )
                                }
                            />
                            <Tooltip content="Use seconds or SPL relative time format. 0 means always suppress." />
                        </ControlGroup>
                        <ControlGroup
                            label="Contacts"
                            labelPosition="top"
                            style={{ margin: '.5em .25em 0 0', flexGrow: '1' }}
                        >
                            <Text
                                style={{ margin: '0 .25em 0 0' }}
                                defaultValue="Contact"
                                describedBy="header-contacts"
                                value={state.itemsValue[state.itemsValue.length - 1]['contact']}
                                onChange={(e) =>
                                    this.handleFormChange(
                                        'contact',
                                        (e.target as HTMLInputElement).value,
                                        state.itemsValue.length - 1
                                    )
                                }
                            />
                            <Tooltip content="Comma delimited list of emails" />
                        </ControlGroup>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <ControlGroup
                            label="Comments"
                            labelPosition="top"
                            style={{ margin: '.5em .25em 0 0', flexGrow: '1' }}
                        >
                            <TextArea
                                style={{ margin: '0 .25em 0 0' }}
                                defaultValue="Comments"
                                describedBy="header-comments"
                                value={state.itemsValue[state.itemsValue.length - 1]['comments']}
                                onChange={(e) =>
                                    this.handleFormChange(
                                        'comments',
                                        (e.target as HTMLInputElement).value,
                                        state.itemsValue.length - 1
                                    )
                                }
                            />
                            <Tooltip content="Be sure to include a ticket number if applicable." />
                        </ControlGroup>
                    </div>
                </FormRows.Row>,
                state.items
            ),
        }));
    };

    handleRequestMove = ({ fromIndex, toIndex }) => {
        this.setState((state) => ({
            items: FormRows.moveRow(fromIndex, toIndex, state.items),
        }));
    };

    handleRequestRemove = (e, { index }) => {
        this.setState((state) => ({
            items: FormRows.removeRow(index, state.items),
        }));
    };

    render() {
        const header = (
            <div>
                <span style={{ display: 'inline-block', width: 50 }} id="header-index">
                    Index
                </span>
                <span style={{ display: 'inline-block', width: 100 }} id="header-sourcetype">
                    Sourcetype
                </span>
                <span style={{ display: 'inline-block', width: 100 }} id="header-host">
                    Host
                </span>
                <span style={{ display: 'inline-block', width: 100 }} id="header-lateSecs">
                    Late Seconds
                </span>
                <span style={{ display: 'inline-block', width: 100 }} id="header-contacts">
                    Contacts
                </span>
                <span style={{ display: 'inline-block', width: 100 }} id="header-comments">
                    Comments
                </span>
            </div>
        );

        return (
            <div>
                <Modal
                    onRequestClose={this.props.onClose}
                    open={this.props.openState}
                    style={{ width: '800px' }}
                >
                    <Modal.Header
                        onRequestClose={this.props.onClose}
                        title="Add Multiple Entries"
                    />
                    <Modal.Body>
                        <FormRows
                            onRequestAdd={this.handleRequestAdd}
                            onRequestMove={this.handleRequestMove}
                            style={{ width: '650px', margin: '0 auto' }}
                        >
                            {this.state.items}
                        </FormRows>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button appearance="default" onClick={this.props.onClose} label="Cancel" />
                        <Button appearance="primary" onClick={this.submitData} label="Submit" />
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default NewBatchRecords;
