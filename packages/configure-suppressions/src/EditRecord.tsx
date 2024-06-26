import React, { useState, useReducer, useEffect, isValidElement } from 'react';
import T from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import DatasourceSelect from './formFields/DatasourceSelect.tsx';
import { editFormReducer } from './EditFormReducer.ts';
import { epochNow, isEmptyOrUndefined, isDateInPast } from './Helpers.ts';
import MessageBar from '@splunk/react-ui/MessageBar';
import { SelectedRow, InitialForm } from './types.ts';
import SuppressUntilInput from './formFields/SuppressUntilInput.tsx';

const initialForm = {
    sourcetypes: '',
    indexes: '',
    hosts: '',
    suppressUntil: '',
} as InitialForm;

const INDEX = 'index';
const SOURCETYPE = 'sourcetype';
const HOST = 'host';

const sourcetypeUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const indexUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const hostUrl = `storage/collections/data/bh_host_cache?query={"last_seen":{"$gt":${epochNow}}}`;

const EditRecord = ({ onUpdate, onClose, openState, selectedRowData }) => {
    const [form, dispatchForm] = useReducer(editFormReducer, initialForm);
    const [, setOpenState] = useState(false);
    const [, setErrorState] = useState(false);
    const [atLeastOneSourceProvided, setAtLeastOneSourceProvided] = useState(true);
    const [suppressUntilValueIsInPast, setSuppressUntilValueIsInPast] = useState(false);

    const validate = (): Promise<boolean> => {
        // Always reset the value when re-validating
        let hasErrors = false;
        let sourceValueCount = 0;
        setAtLeastOneSourceProvided(true);
        setSuppressUntilValueIsInPast(false);
        setErrorState(false);
        return new Promise((res, rej) => {
            for (const [k, v] of Object.entries(form)) {
                console.log(`validate form ${k} ::: ${v}`);

                const sources = ['host', 'index', 'sourcetype'];

                if (sources.includes(k) && !isEmptyOrUndefined(v as string)) {
                    sourceValueCount++;
                }

                if (isDateInPast(form.suppressUntil) && form.suppressUntil !== '0') {
                    setSuppressUntilValueIsInPast(true);
                    hasErrors = true;
                }
            }

            if (sourceValueCount === 0) {
                setAtLeastOneSourceProvided(false);
                hasErrors = true;
            }

            res(hasErrors);
        });
    };

    const submitData = async () => {
        await validate().then((hasErrors) => {
            console.log('FORM ??? ', hasErrors);
            if (!hasErrors) {
                updateRecord(form);
                onClose();
            }
        });
    };

    const updateRecord = (form) => {
        console.log('updateRecord ::: ', form);
        // Updates UI before sending it off to the API
        dispatchForm({
            value: [form as SelectedRow],
            type: 'all',
        });

        onUpdate(form);
    };

    const handleFormChange = (type: string, value: any[] | any) => {
        console.log('handleFormChange ::: ', { type, value });
        dispatchForm({ type, value });
    };

    const populateForm = () => {
        console.log('populate form ::: ', selectedRowData);
        selectedRowData = Object.assign(initialForm, selectedRowData);
        console.log('selectedRowData ??? ', selectedRowData);
        dispatchForm({
            value: [selectedRowData as SelectedRow],
            type: 'all',
        });
    };

    useEffect(() => {
        console.log('selectedRowData ::: ', selectedRowData);
        setOpenState(true);
        populateForm();
    }, [openState]);

    const indexHasValue = selectedRowData.index !== undefined && selectedRowData.index !== '';
    const hostHasValue = selectedRowData.host !== undefined && selectedRowData.host !== '';
    const sourcetypeHasValue =
        selectedRowData.sourcetype !== undefined && selectedRowData.sourcetype !== '';
    const suppressUntilHasValue =
        selectedRowData.suppressUntil !== undefined && selectedRowData.suppressUntil !== '';

    return (
        <div>
            <Modal onRequestClose={onClose} open={openState} style={{ width: '450px' }}>
                <Modal.Header onRequestClose={onClose} title="Edit Entry" />
                <Modal.Body>
                    <form>
                        {sourcetypeHasValue &&
                        hostHasValue &&
                        indexHasValue &&
                        !atLeastOneSourceProvided ? (
                            <MessageBar type="error">
                                You must provide a value for index, sourcetype, or host.
                            </MessageBar>
                        ) : (
                            ''
                        )}
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
                        <ControlGroup
                            label="Suppress Until"
                            labelPosition="top"
                            style={{ margin: '.5em .25em 0 0' }}
                        >
                            <SuppressUntilInput
                                type="suppressUntil"
                                value={form.suppressUntil}
                                setValue={handleFormChange}
                            />
                        </ControlGroup>
                        {suppressUntilValueIsInPast ? (
                            <MessageBar type="error">
                                'Suppress Until' date cannot be in the past.
                            </MessageBar>
                        ) : (
                            ''
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
