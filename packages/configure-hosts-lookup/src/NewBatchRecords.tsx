import React, { useReducer } from 'react';
import { newBatchRecordsFormReducer } from './NewBatchFormReducer.ts';
import { epochNow } from './Helpers.ts';
import FormRows from '@splunk/react-ui/FormRows';
import { createDOMID } from '@splunk/ui-utils/id';
import Text from '@splunk/react-ui/Text';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';

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
    onClose: () => {};
    onSubmit: (f: any[]) => {};
    dispatchForm: () => {};
    form: Form;
    openState: boolean;
}

interface State {
    items: any[];
    itemsValue: any[];
}

// const initialForm = {
//     items: []
// } as Form;

class NewBatchRecords extends React.PureComponent<Props, State> {
    constructor(props) {
        super(props);

        const items = [
            // {
            //     sourcetype: '',
            // },
            // <FormRows.Row index={0} key="0" onRequestRemove={this.handleRequestRemove}>
            //     <Text style={{ margin: '.5em 0' }} defaultValue="Index" />
            //     <Text
            //         style={{ margin: '.5em 0' }}
            //         defaultValue="Sourcetype"
            //         value={this.state.items[0]['sourcetype']}
            //         onChange={(value, index) => this.handleFormChange('sourcetype', value, index)}
            //     />
            //     <Text style={{ margin: '.5em 0' }} defaultValue="Host" />
            //     <Text style={{ margin: '.5em 0' }} defaultValue="Late Seconds" />
            //     <Text style={{ margin: '.5em 0' }} defaultValue="Contacts" />
            //     <Text style={{ margin: '.5em 0' }} defaultValue="Comments" />
            // </FormRows.Row>,
        ];

        this.state = {
            items,
            itemsValue: [],
        };
    }

    submitData = () => {
        console.log('FORM ??? ', this.state.items);
        this.props.onSubmit(this.state.items);
        this.props.onClose();
    };

    handleFormChange = (label, value, index): void => {
        console.log('current value ::: ', label, value, index);
        const currentItemsValueArray = this.state.itemsValue;
        currentItemsValueArray[index][label] = value;

        this.setState((state) => {
            itemsValue: currentItemsValueArray;
        });
    };

    handleRequestAdd = () => {
        const newValue = {
            sourcetype: '',
        };

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
                    <Text style={{ margin: '.5em 0' }} defaultValue="Index" />
                    <Text
                        style={{ margin: '.5em 0' }}
                        defaultValue="Sourcetype"
                        value={state.itemsValue[state.itemsValue.length - 1]['sourcetype']}
                        onChange={(e) =>
                            this.handleFormChange(
                                'sourcetype',
                                (e.target as HTMLInputElement).value,
                                state.itemsValue.length - 1
                            )
                        }
                    />
                    <Text style={{ margin: '.5em 0' }} defaultValue="Host" />
                    <Text style={{ margin: '.5em 0' }} defaultValue="Late Seconds" />
                    <Text style={{ margin: '.5em 0' }} defaultValue="Contacts" />
                    <Text style={{ margin: '.5em 0' }} defaultValue="Comments" />
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
        return (
            <div>
                <Modal
                    onRequestClose={this.props.onClose}
                    open={this.props.openState}
                    style={{ width: '400px' }}
                >
                    <Modal.Header onRequestClose={this.props.onClose} title="New Entry For Real" />
                    <Modal.Body>
                        <form>
                            {/* <DatasourceMultiSelect
                            type={INDEXES}
                            url={indexUrl}
                            selected={form.indexes}
                            setSelected={handleFormChange}
                        />
                        <DatasourceMultiSelect
                            type={HOSTS}
                            url={hostUrl}
                            selected={form.hosts}
                            setSelected={handleFormChange}
                        />
                        <DatasourceMultiSelect
                            type={SOURCETYPES}
                            url={sourcetypeUrl}
                            selected={form.sourcetypes}
                            setSelected={handleFormChange}
                        />
                        <LateSecondsInput type={LATE_SECONDS} setSelected={handleFormChange} />
                        <ContactInput type={CONTACT} setSelected={handleFormChange} />
                        <CommentsTextarea type={COMMENTS} setSelected={handleFormChange} /> */}
                        </form>
                        <FormRows
                            onRequestAdd={this.handleRequestAdd}
                            onRequestMove={this.handleRequestMove}
                            style={{ width: 300 }}
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

// const [form, dispatchForm] = useReducer(newBatchRecordsFormReducer, initialForm);

// const withUseReducer =
//     (...useReducerArgs) =>
//     (Component) =>
//     (props) => {
//         const [form, dispatchForm] = useReducer(newBatchRecordsFormReducer, initialForm);

//         return <NewBatchRecords {...props} {...{ form, dispatchForm }} />;
//     };

export default NewBatchRecords;
