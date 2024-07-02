import React, { useReducer, useState } from 'react';
import T from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import { newFormReducer } from './NewFormReducer.ts';
import { epochNow, isEmptyOrUndefined, isDateInPast } from './Helpers.ts';
import MessageBar from '@splunk/react-ui/MessageBar';
import DatasourceSelect from './formFields/DatasourceSelect.tsx';
import SuppressUntilInput from './formFields/SuppressUntilInput.tsx';

const initialForm = {
    sourcetype: '',
    index: '',
    host: '',
    lateSeconds: null,
    contact: null,
    comments: null,
};

const INDEX = 'index';
const SOURCETYPE = 'sourcetype';
const HOST = 'host';

const sourcetypeUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const indexUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const hostUrl = `storage/collections/data/bh_host_cache?query={"last_seen":{"$gt":${epochNow}}}`;

const NewRecord = ({ onSubmit, onClose, openState }) => {
    const [form, dispatchForm] = useReducer(newFormReducer, initialForm);
    const [atLeastOneSourceProvided, setAtLeastOneSourceProvided] = useState(true);
    const [suppressUntilValueIsInPast, setSuppressUntilValueIsInPast] = useState(false);

    const validate = (): Promise<boolean> => {
        console.log('VALIDATE!!!');
        // Always reset the value when re-validating
        let hasErrors = false;
        let sourceValueCount = 0;
        setAtLeastOneSourceProvided(true);
        setSuppressUntilValueIsInPast(false);
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

            console.log('sourceValueCount ::: ', sourceValueCount);

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
                onSubmit(form);
                onClose();
            }
        });
    };

    const handleFormChange = (type: string, value: any[] | any) => {
        console.log('handleFormChange ::: ', { type, value });
        dispatchForm({ type, value });
    };

    return (
        <div>
            <Modal onRequestClose={onClose} open={openState} style={{ width: '450px' }}>
                <Modal.Header onRequestClose={onClose} title="New Entry" />
                <Modal.Body>
                    <form>
                        {!atLeastOneSourceProvided ? (
                            <MessageBar style={{ marginTop: '.5em' }} type="error">
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
                        <div style={{ display: 'flex' }}>
                            <ControlGroup
                                label="Suppress Until"
                                labelPosition="top"
                                style={{ margin: '.5em .25em 0 0', flexGrow: '1' }}
                            >
                                <SuppressUntilInput
                                    type="suppressUntil"
                                    value="0"
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
                        </div>
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
