import React, { useState, useReducer, useEffect } from 'react';
import T from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import DatasourceSelect from './formFields/DatasourceSelect.tsx';
import LateSecondsInput from './formFields/LateSecondsInput.tsx';
import { editFormReducer } from './EditFormReducer.ts';
import { epochNow } from './Helpers.ts';
import ContactInput from './formFields/ContactInput.tsx';
import CommentsTextarea from './formFields/CommentsTextarea.tsx';
import { SelectedRow, InitialForm } from './types.ts';

const initialForm = {
    sourcetypes: '',
    indexes: '',
    hosts: '',
    lateSecs: null,
    contact: null,
    comments: null,
} as InitialForm;

const INDEX = 'index';
const SOURCETYPE = 'sourcetype';
const HOST = 'host';
const LATE_SECONDS = 'lateSecs';
const CONTACT = 'contact';
const COMMENTS = 'comments';

const sourcetypeUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const indexUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const hostUrl = `storage/collections/data/bh_host_cache?query={"last_seen":{"$gt":${epochNow}}}`;

const EditRecord = ({ onUpdate, onClose, openState, selectedRowData }) => {
    const [form, dispatchForm] = useReducer(editFormReducer, initialForm);
    const [open, setOpenState] = useState(false);

    const submitData = () => {
        console.log('FORM ??? ', form);
        updateRecord(form);
        onClose();
    };

    const updateRecord = (form) => {
        // Updates UI before sending it off to the API
        dispatchForm({
            value: [form as SelectedRow],
            type: 'all',
        });

        console.log('POST data ::: ', form);

        onUpdate(form);
    };

    const handleFormChange = (type: string, value: any[] | any) => {
        console.log('handleFormChange ::: ', { type, value });
        dispatchForm({ type, value });
    };

    const populateForm = () => {
        console.log('populate form ::: ', selectedRowData);
        dispatchForm({
            value: [selectedRowData as SelectedRow],
            type: 'all',
        });
    };

    useEffect(() => {
        setOpenState(true);
        populateForm();
    }, [openState]);

    useEffect(() => {
        console.log('form changed ::: ', form);
    }, [form]);

    return (
        <div>
            <Modal onRequestClose={onClose} open={openState} style={{ width: '450px' }}>
                <Modal.Header onRequestClose={onClose} title="Edit Entry" />
                <Modal.Body>
                    <form>
                        {selectedRowData.index !== undefined && selectedRowData.index !== '' ? (
                            <ControlGroup
                                label="Index"
                                labelPosition="top"
                                style={{ margin: '.5em .25em 0 0' }}
                            >
                                <DatasourceSelect
                                    type={INDEX}
                                    url={indexUrl}
                                    value={form.index}
                                    setValue={handleFormChange}
                                />
                            </ControlGroup>
                        ) : (
                            'Loading...'
                        )}
                        {typeof selectedRowData.host !== 'undefined' ? (
                            <ControlGroup
                                label="Host"
                                labelPosition="top"
                                style={{ margin: '.5em .25em 0 0' }}
                            >
                                <DatasourceSelect
                                    type={HOST}
                                    url={hostUrl}
                                    value={form.host}
                                    setValue={handleFormChange}
                                />
                            </ControlGroup>
                        ) : (
                            'Loading...'
                        )}
                        {typeof selectedRowData.sourcetype !== 'undefined' ? (
                            <ControlGroup
                                label="Sourcetype"
                                labelPosition="top"
                                style={{ margin: '.5em .25em 0 0' }}
                            >
                                <DatasourceSelect
                                    type={SOURCETYPE}
                                    url={sourcetypeUrl}
                                    value={form.sourcetype}
                                    setValue={handleFormChange}
                                />
                            </ControlGroup>
                        ) : (
                            'Loading'
                        )}
                        {typeof selectedRowData.lateSecs !== 'undefined' ? (
                            <LateSecondsInput
                                type={LATE_SECONDS}
                                setSelected={handleFormChange}
                                value={form.lateSecs}
                            />
                        ) : (
                            'Loading Woof...'
                        )}
                        {typeof selectedRowData.contact !== 'undefined' ? (
                            <ContactInput
                                type={CONTACT}
                                setSelected={handleFormChange}
                                value={form.contact}
                            />
                        ) : (
                            'Loading Wee...'
                        )}
                        {typeof selectedRowData.comments !== 'undefined' ? (
                            <CommentsTextarea
                                type={COMMENTS}
                                setSelected={handleFormChange}
                                value={form.comments}
                            />
                        ) : (
                            'Loading Woo...'
                        )}
                    </form>
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
    remove: T.func,
    update: T.func,
    onClose: T.func,
    selectedRow: T.object,
    openState: T.bool,
};
export default EditRecord;
