import React, { useState, useReducer } from 'react';
import T from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import Tooltip from '@splunk/react-ui/Tooltip';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import { newFormReducer } from './NewFormReducer.ts';
import { epochNow } from './Helpers.ts';
import ContactInput from './formFields/ContactInput.tsx';
import CommentsTextarea from './formFields/CommentsTextarea.tsx';
import DatasourceSelect from './formFields/DatasourceSelect.tsx';
import LateSecondsInput from './formFields/LateSecondsInput.tsx';

const initialForm = {
    sourcetypes: [],
    indexes: [],
    hosts: [],
    lateSeconds: null,
    contact: null,
    comments: null,
};

const INDEXES = 'index';
const SOURCETYPES = 'sourcetype';
const HOSTS = 'host';
const LATE_SECONDS = 'lateSecs';
const CONTACT = 'contact';
const COMMENTS = 'comments';

const sourcetypeUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const indexUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const hostUrl = `storage/collections/data/bh_host_cache?query={"last_seen":{"$gt":${epochNow}}}`;

const NewRecord = ({ onSubmit, onClose, openState }) => {
    const [form, dispatchForm] = useReducer(newFormReducer, initialForm);

    const submitData = () => {
        console.log('FORM ??? ', form);
        onSubmit(form);
        onClose();
    };

    const handleFormChange = (type: string, value: any[] | any) => {
        console.log('current type ::: ', type);
        console.log('current value ::: ', value);
        dispatchForm({ type, value });
    };

    return (
        <div>
            <Modal onRequestClose={onClose} open={openState} style={{ width: '450px' }}>
                <Modal.Header onRequestClose={onClose} title="New Entry For Real" />
                <Modal.Body>
                    <form>
                        <ControlGroup
                            label="Index"
                            labelPosition="top"
                            style={{ margin: '.5em .25em 0 0' }}
                        >
                            <DatasourceSelect
                                type={INDEXES}
                                url={indexUrl}
                                value={form.index}
                                setValue={handleFormChange}
                            />
                            <Tooltip content="If no indexes are found then you must manually enter a value." />
                        </ControlGroup>
                        <ControlGroup
                            label="Host"
                            labelPosition="top"
                            style={{ margin: '.5em .25em 0 0' }}
                        >
                            <DatasourceSelect
                                type={HOSTS}
                                url={hostUrl}
                                value={form.host}
                                setValue={handleFormChange}
                            />
                            <Tooltip content="If no hosts are found then you must manually enter a value." />
                        </ControlGroup>
                        <ControlGroup
                            label="Sourcetype"
                            labelPosition="top"
                            style={{ margin: '.5em .25em 0 0' }}
                        >
                            <DatasourceSelect
                                type={SOURCETYPES}
                                url={sourcetypeUrl}
                                value={form.sourcetype}
                                setValue={handleFormChange}
                            />
                            <Tooltip content="If no sourcetypes are found then you must manually enter a value." />
                        </ControlGroup>
                        <LateSecondsInput type={LATE_SECONDS} setSelected={handleFormChange} />
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
