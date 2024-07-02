import React, { useEffect, useReducer, useState } from 'react';
import T from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import { newFormReducer } from './NewFormReducer.ts';
import { epochNow, isEmptyOrUndefined, isValidEmail } from './Helpers.ts';
import ContactInput from './formFields/ContactInput.tsx';
import MessageBar from '@splunk/react-ui/MessageBar';
import CommentsTextarea from './formFields/CommentsTextarea.tsx';
import DatasourceSelect from './formFields/DatasourceSelect.tsx';
import LateSecondsInput from './formFields/LateSecondsInput.tsx';

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
const LATE_SECONDS = 'lateSecs';
const CONTACT = 'contact';
const COMMENTS = 'comments';

const sourcetypeUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const indexUrl = `storage/collections/data/bh_index_cache?query={"last_seen":{"$gt":${epochNow}}}`;
const hostUrl = `storage/collections/data/bh_host_cache?query={"last_seen":{"$gt":${epochNow}}}`;

const NewRecord = ({ onSubmit, onClose, openState }) => {
    const [form, dispatchForm] = useReducer(newFormReducer, initialForm);
    const [, setOpenState] = useState(false);
    const [, setErrorState] = useState(false);
    const [lateSecsErrorState, setLateSecsErrorState] = useState({
        invalidNumber: false,
        empty: false,
    });
    const [atLeastOneSourceProvided, setAtLeastOneSourceProvided] = useState(true);
    const [contactErrorState, setContactErrorState] = useState(false);

    useEffect(() => {
        if (!openState) clearAllErrors();
    }, [openState]);

    const validate = (): Promise<boolean> => {
        console.log('VALIDATE!!!');
        // Always reset the value when re-validating
        let hasErrors = false;
        let sourceValueCount = 0;
        setContactErrorState(false);
        setLateSecsErrorState({
            invalidNumber: false,
            empty: false,
        });
        setAtLeastOneSourceProvided(true);
        setErrorState(false);
        return new Promise((res, rej) => {
            for (const [k, v] of Object.entries(form)) {
                console.log(`validate form ${k} ::: ${v}`);

                const sources = ['host', 'index', 'sourcetype'];

                if (sources.includes(k) && !isEmptyOrUndefined(v as string)) {
                    sourceValueCount++;
                }

                if (k === 'contact' && v !== undefined && v !== null) {
                    if (!isEmptyOrUndefined(v as string)) {
                        if ((v as string).includes(',')) {
                            const validEmailCount = (v as string).split(',').filter((email) => {
                                return isValidEmail(email);
                            });
                            if (
                                (v as string).split(',').length > 0 &&
                                validEmailCount.length !== (v as string).split(',').length
                            ) {
                                setContactErrorState(true);
                                hasErrors = true;
                            }
                        } else if (!isValidEmail(v)) {
                            setContactErrorState(true);
                            hasErrors = true;
                        }
                    }
                }

                if (k === 'lateSecs' && isEmptyOrUndefined(v as string)) {
                    setLateSecsErrorState({
                        ...lateSecsErrorState,
                        empty: true,
                    });
                    hasErrors = true;
                } else if (k === 'lateSecs' && (isNaN(v as number) || (v as number) < 0)) {
                    setLateSecsErrorState({
                        ...lateSecsErrorState,
                        invalidNumber: true,
                    });
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

    const clearAllErrors = () => {
        setAtLeastOneSourceProvided(true);
        setLateSecsErrorState({
            empty: false,
            invalidNumber: false,
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
                        <LateSecondsInput
                            hasError={lateSecsErrorState.empty || lateSecsErrorState.invalidNumber}
                            type={LATE_SECONDS}
                            setSelected={handleFormChange}
                        />
                        {lateSecsErrorState.empty || lateSecsErrorState.invalidNumber ? (
                            <MessageBar style={{ marginTop: '.5em' }} type="error">
                                Late Seconds must not be empty. Must be a value of 0 or greater.
                            </MessageBar>
                        ) : (
                            ''
                        )}
                        <ContactInput type={CONTACT} setSelected={handleFormChange} />
                        {contactErrorState ? (
                            <MessageBar style={{ marginTop: '.5em' }} type="error">
                                One or more email address is invalid.
                            </MessageBar>
                        ) : (
                            ''
                        )}
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
