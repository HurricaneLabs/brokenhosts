import React, { useState, useReducer } from 'react';
import T from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import DatasourceMultiSelect from './DatasourceMultiselect.tsx';
import { formReducer } from './FormReducer.ts';
import { epochNow } from './Helpers.ts';

const initialForm = {
    sourcetypes: [],
    indexes: [],
    hosts: [],
};

const INDEX = 'index';
const SOURCETYPE = 'sourcetype';
const HOST = 'host';

const sourcetypeUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const indexUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const hostUrl = `storage/collections/data/bh_host_cache?query={"last_seen":{"$gt":${epochNow}}}`;

const EditRecord = ({ onSubmit, onClose, openState }) => {
    const [form, dispatchForm] = useReducer(formReducer, initialForm);

    const submitData = () => {
        onSubmit();
        onClose();
    };

    const handleFormChange = (type: string, value: string[]) => {
        console.log('current value ::: ', value);
        dispatchForm({ type, value });
    };

    return (
        <div>
            <Modal onRequestClose={onClose} open={openState} style={{ width: '900px' }}>
                <Modal.Header onRequestClose={onClose} title="New Entry" />
                <Modal.Body>
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
