import React, { useReducer } from 'react';
import T from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
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

const INDEX = 'index';
const SOURCETYPE = 'sourcetype';
const HOST = 'host';
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
        dispatchForm({ type, value });
    };

    return (
        <div>
            <Modal onRequestClose={onClose} open={openState} style={{ width: '450px' }}>
                <Modal.Header onRequestClose={onClose} title="New Entry" />
                <Modal.Body>
                    <form>
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
