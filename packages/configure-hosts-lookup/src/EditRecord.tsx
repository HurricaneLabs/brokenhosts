import React, { useState, useReducer, useEffect } from 'react';
import T from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import DatasourceSelect from './formFields/DatasourceSelect.tsx';
import LateSecondsInput from './formFields/LateSecondsInput.tsx';
import { editFormReducer } from './EditFormReducer.ts';
import { epochNow } from './Helpers.ts';
import ContactInput from './formFields/ContactInput.tsx';
import CommentsTextarea from './formFields/CommentsTextarea.tsx';
import { SelectedRow } from './types.ts';

const initialForm = {
    sourcetypes: [],
    indexes: [],
    hosts: [],
    lateSecs: null,
    contact: null,
    comments: null,
};

const INDEX = 'index';
const SOURCETYPE = 'sourcetype';
const HOST = 'host';
const LATE_SECONDS = 'late_seconds';
const CONTACT = 'contact';
const COMMENTS = 'comments';

const sourcetypeUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const indexUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const hostUrl = `storage/collections/data/bh_host_cache?query={"last_seen":{"$gt":${epochNow}}}`;

const EditRecord = ({ onUpdate, onClose, openState, selectedRowData }) => {
    const [form, dispatchForm] = useReducer(editFormReducer, initialForm);

    const submitData = () => {
        onUpdate();
        onClose();
    };
    ('');
    const handleFormChange = (type: string, value: string[] | string) => {
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
        populateForm();
    }, [openState]);

    return (
        <div>
            <Modal onRequestClose={onClose} open={openState} style={{ width: '450px' }}>
                <Modal.Header onRequestClose={onClose} title="Edit Entry" />
                <Modal.Body>
                    <form>
                        {typeof selectedRowData.index !== 'undefined' ? (
                            <DatasourceSelect
                                type={INDEX}
                                url={indexUrl}
                                selected={form.index}
                                editValue={selectedRowData.index}
                                setSelected={handleFormChange}
                            />
                        ) : (
                            'Loading...'
                        )}
                        {typeof selectedRowData.host !== 'undefined' ? (
                            <DatasourceSelect
                                type={HOST}
                                url={hostUrl}
                                selected={form.host}
                                editValue={selectedRowData.host}
                                setSelected={handleFormChange}
                            />
                        ) : (
                            'Loading...'
                        )}
                        {typeof selectedRowData.sourcetype !== 'undefined' ? (
                            <DatasourceSelect
                                type={SOURCETYPE}
                                url={sourcetypeUrl}
                                selected={form.sourcetype}
                                editValue={selectedRowData.sourcetype}
                                setSelected={handleFormChange}
                            />
                        ) : (
                            'Loading'
                        )}
                        {typeof selectedRowData.lateSecs !== 'undefined' ? (
                            <LateSecondsInput
                                type={LATE_SECONDS}
                                editValue={selectedRowData.lateSecs}
                                setSelected={handleFormChange}
                            />
                        ) : (
                            'Loading Woof...'
                        )}
                        {typeof selectedRowData.contact !== 'undefined' ? (
                            <ContactInput
                                type={CONTACT}
                                editValue={selectedRowData.contact}
                                setSelected={handleFormChange}
                            />
                        ) : (
                            'Loading Wee...'
                        )}
                        {typeof selectedRowData.comments !== 'undefined' ? (
                            <CommentsTextarea
                                type={COMMENTS}
                                editValue={selectedRowData.comments}
                                setSelected={handleFormChange}
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
