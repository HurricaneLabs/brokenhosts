import React, { useState, useReducer } from 'react';
import T from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import SourcetypeMultiSelect from './SourcetypeMultiselect';
import IndexMultiSelect from './IndexMultiselect';
import HostMultiSelect from './HostMultiSelect.tsx';
import { formReducer } from './FormReducer.ts';

type InitialForm = {
    sourcetypes: string[];
    indexes: string[];
    hosts: string[];
};

type Action = {
    type: string;
    value: string | string[];
};

const initialForm = {
    sourcetypes: [],
    indexes: [],
    hosts: [],
} as InitialForm;

const EditRecord = ({ onSubmit, onClose, openState }) => {
    // pass in the remove and update functions as props
    const [selectedIndexes, setSelectedIndexes] = useState([]);
    const [selectedSourcetypes, setSelectedSourcetypes] = useState<string[]>([]);
    const [selectedHosts, setSelectedHosts] = useState([]);
    const [lateSecs, setSelectedLateSecs] = useState('');
    const [suppressUntil, setSelectedSuppressUntil] = useState('');
    const [contacts, setSelectedContacts] = useState('');
    const [comments, setSelectedComments] = useState('');
    const [form, dispatchForm] = useReducer(formReducer, initialForm);

    const submitData = () => {
        // update the record and close the modal
        // for some reason I needed to do this and I couldn't store in state
        // const currentRow = { ...selectedRow, field1: newField1, field2: newField2 };

        // update(selectedRow._key, currentRow);
        // setNewField1('');
        // setNewField2('');
        onSubmit();
        onClose();
    };

    const handleFormChange = (type: string, value: string | string[]) => {
        console.log('current form value ::: ', form);
        dispatchForm({
            type,
            value,
        });
    };

    return (
        <div>
            <Modal onRequestClose={onClose} open={openState} style={{ width: '900px' }}>
                <Modal.Header onRequestClose={onClose} title="New Entry" />
                <Modal.Body>
                    <SourcetypeMultiSelect
                        selected={form.sourcetypes}
                        setSelected={handleFormChange}
                    />
                    <IndexMultiSelect selected={form.indexes} setSelected={handleFormChange} />
                    <HostMultiSelect selected={form.hosts} setSelected={handleFormChange} />
                </Modal.Body>
                <Modal.Footer>
                    <Button appearance="default" onClick={onClose} label="Cancel" />
                    <Button appearance="primary" onClick={submitData} label="Submit" />
                </Modal.Footer>
            </Modal>
        </div>
    );
};

EditRecord.propTypes = {
    onSubmit: T.func,
    onClose: T.func,
    openState: T.bool,
};
export default EditRecord;
