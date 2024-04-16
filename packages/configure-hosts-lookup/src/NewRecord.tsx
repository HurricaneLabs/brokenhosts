import React, { useState, useReducer } from 'react';
import T from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import DatasourceMultiSelect from './formFields/DatasourceMultiselect.tsx';
import LateSecondsInput from './formFields/LateSecondsInput.tsx';
import { newFormReducer } from './NewFormReducer.ts';
import { epochNow } from './Helpers.ts';
import ContactInput from './formFields/ContactInput.tsx';
import CommentsTextarea from './formFields/CommentsTextarea.tsx';

const initialForm = {
    sourcetypes: [],
    indexes: [],
    hosts: [],
    lateSeconds: null,
    contact: null,
    comments: null,
};

const INDEXES = 'indexes';
const SOURCETYPES = 'sourcetypes';
const HOSTS = 'hosts';
const LATE_SECONDS = 'late_seconds';
const contact = 'constacts';
const COMMENTS = 'comments';

const sourcetypeUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const indexUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const hostUrl = `storage/collections/data/bh_host_cache?query={"last_seen":{"$gt":${epochNow}}}`;

const EditRecord = ({ onSubmit, onClose, openState }) => {
    const [form, dispatchForm] = useReducer(newFormReducer, initialForm);

    const submitData = () => {
        console.log('FORM ??? ', form);
        onSubmit(form);
        onClose();
    };

    const handleFormChange = (type: string, value: any[] | string | number | boolean) => {
        console.log('current value ::: ', value);
        dispatchForm({ type, value });
    };

    return (
        <div>
            <Modal onRequestClose={onClose} open={openState} style={{ width: '450px' }}>
                <Modal.Header onRequestClose={onClose} title="New Entry For Real" />
                <Modal.Body>
                    <form>
                        <DatasourceMultiSelect
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
                        <ContactInput type={contact} setSelected={handleFormChange} />
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

EditRecord.propTypes = {
    onSubmit: T.func,
    onClose: T.func,
    openState: T.bool,
};
export default EditRecord;
