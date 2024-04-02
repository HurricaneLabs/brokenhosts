import React, { useState, useReducer } from 'react';
import T from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import DatasourceMultiSelect from './formFields/DatasourceMultiselect.tsx';
import SuppressUntilInput from './formFields/SuppressUntilInput.tsx';
import { newFormReducer } from './NewFormReducer.ts';
import { epochNow } from './Helpers.ts';
import ContactInput from './formFields/ContactInput.tsx';
import CommentsTextarea from './formFields/CommentsTextarea.tsx';

const initialForm = {
    sourcetypes: [],
    indexes: [],
    hosts: [],
    lateSeconds: null,
    CONTACT: null,
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

const NewRecord = ({ onSubmit, onClose, openState }) => {
    const [form, dispatchForm] = useReducer(newFormReducer, initialForm);

    const submitData = () => {
        onSubmit();
        onClose();
    };

    const handleFormChange = (type: string, value: string[] | string) => {
        console.log('current value ::: ', value);
        dispatchForm({ type, value });
    };

    return (
        <div>
            <Modal onRequestClose={onClose} open={openState} style={{ width: '450px' }}>
                <Modal.Header onRequestClose={onClose} title="New Entry" />
                <Modal.Body>
                    <form>
                        <DatasourceMultiSelect
                            type={INDEX}
                            url={indexUrl}
                            selected={form.indexes}
                            setSelected={handleFormChange}
                        />
                        <DatasourceMultiSelect
                            type={HOST}
                            url={hostUrl}
                            selected={form.indexes}
                            setSelected={handleFormChange}
                        />
                        <DatasourceMultiSelect
                            type={SOURCETYPE}
                            url={sourcetypeUrl}
                            selected={form.indexes}
                            setSelected={handleFormChange}
                        />
                        <SuppressUntilInput type={LATE_SECONDS} setSelected={handleFormChange} />
                        <ContactInput type={CONTACT} setSelected={handleFormChange} />
                        <CommentsTextarea type={COMMENTS} setSelected={handleFormChange} />
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

NewRecord.propTypes = {
    onSubmit: T.func,
    onClose: T.func,
    openState: T.bool,
};
export default NewRecord;
