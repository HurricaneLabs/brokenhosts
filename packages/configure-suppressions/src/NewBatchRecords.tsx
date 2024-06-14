import React from 'react';
import FormRows from '@splunk/react-ui/FormRows';
import { createDOMID } from '@splunk/ui-utils/id';
import Text from '@splunk/react-ui/Text';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import TextArea from '@splunk/react-ui/TextArea';
import { epochNow, isEmptyOrUndefined, isValidEmail } from './Helpers.ts';
import DatasourceSelect from './formFields/DatasourceSelect.tsx';
import Heading from '@splunk/react-ui/Heading';
import Tooltip from '@splunk/react-ui/Tooltip';
import MessageBar from '@splunk/react-ui/MessageBar';
import SuppressUntilInput from './formFields/SuppressUntilInput.tsx';

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
    lateSecsNotValidError: boolean;
    sourceIsEmptyError: boolean;
    lateSecsEmptyError: boolean;
    invalidEmailAddress: boolean;
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
            lateSecsNotValidError: false,
            sourceIsEmptyError: false,
            lateSecsEmptyError: false,
            invalidEmailAddress: false,
        };
    }

    validate = async () => {
        let hasError = false;

        this.state.itemsValue.map((item, idx) => {
            console.log('Current Item ::: ', item);

            this.setState({ lateSecsNotValidError: false });
            this.setState({ lateSecsEmptyError: false });
            this.setState({ sourceIsEmptyError: false });
            this.setState({ invalidEmailAddress: false });

            console.log('is not a number??? ', isNaN(Number(item.value)));

            console.log("item['host'] ", item['host']);
            console.log("item['index'] ", item['index']);
            console.log("item['sourcetype'] ", item['sourcetype']);
            console.log("item['suppressUntil'] ", item['suppressUntil']);

            const emptySourceCount =
                isEmptyOrUndefined(item['host']) &&
                isEmptyOrUndefined(item['index']) &&
                isEmptyOrUndefined(item['sourcetype']);

            console.log('contact ::: ', item['contact']);

            if (isEmptyOrUndefined(item['lateSecs'])) {
                hasError = true;
                this.setState({ lateSecsEmptyError: true });
            }

            if (emptySourceCount) {
                hasError = true;
                this.setState({ sourceIsEmptyError: true });
            }

            if (!isEmptyOrUndefined(item['lateSecs']) && isNaN(item['lateSecs'])) {
                hasError = true;
                this.setState({ lateSecsNotValidError: true });
            }

            if (hasError) {
                throw new Error('Validation has failed');
            }
        });
    };

    submitData = async () => {
        await this.validate()
            .then((_) => {
                console.log('FORM ??? ', this.state.itemsValue);
                console.log('STATE OF ITEMS ::: ', this.state.items);

                this.props.onSubmit(this.state.itemsValue);
                this.props.onClose();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    handleFormChange = (type: string, value: any, index?: number | undefined): void => {
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
                            label="Suppress Until"
                            labelPosition="top"
                            style={{ margin: '.5em .25em 0 0', flexGrow: '1' }}
                        >
                            <SuppressUntilInput
                                type="suppressUntil"
                                index={state.items.length}
                                value={
                                    state.itemsValue[state.itemsValue.length - 1]['suppressUntil']
                                }
                                setValue={this.handleFormChange}
                            />
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
                        {this.state.lateSecsNotValidError ? (
                            <MessageBar type="error">
                                One or more row's 'Late Seconds' value is not valid. It must be a
                                number.
                            </MessageBar>
                        ) : (
                            ''
                        )}
                        {this.state.lateSecsEmptyError ? (
                            <MessageBar type="error">
                                One or more row's 'Late Seconds' is empty. It must be a number.
                            </MessageBar>
                        ) : (
                            ''
                        )}
                        {this.state.sourceIsEmptyError ? (
                            <MessageBar type="error">
                                One or more row's Index, Sourcetype, or Host is missing a value. At
                                least one value per row must be provided.
                            </MessageBar>
                        ) : (
                            ''
                        )}
                        {this.state.invalidEmailAddress ? (
                            <MessageBar type="error">
                                One or more email address is not valid.
                            </MessageBar>
                        ) : (
                            ''
                        )}
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
