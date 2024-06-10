import React, { useState, useReducer, useEffect, isValidElement } from 'react';
import T from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import DatasourceSelect from './formFields/DatasourceSelect.tsx';
import LateSecondsInput from './formFields/LateSecondsInput.tsx';
import { editFormReducer } from './EditFormReducer.ts';
import { epochNow, isEmptyOrUndefined, isValidEmail } from './Helpers.ts';
import ContactInput from './formFields/ContactInput.tsx';
import CommentsTextarea from './formFields/CommentsTextarea.tsx';
import MessageBar from '@splunk/react-ui/MessageBar';
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
    const [hasError, setErrorState] = useState(false);
    const [lateSecsErrorState, setLateSecsErrorState] = useState({
        invalidNumber: false,
        empty: false,
    });
    const [atLeastOneSourceProvided, setAtLeastOneSourceProvided] = useState(true);
    const [contactErrorState, setcontactErrorState] = useState(false);

    const validate = (): Promise<boolean> => {
        console.log('VALIDATE!!!');
        // Always reset the value when re-validating
        let hasErrors = false;
        let atLeastOneSource = false;
        setcontactErrorState(false);
        setLateSecsErrorState({
            invalidNumber: false,
            empty: false,
        });
        setAtLeastOneSourceProvided(false);
        setErrorState(false);
        return new Promise((res, rej) => {
            for (const [k, v] of Object.entries(form)) {
                console.log(`validate form ${k} ::: ${v}`);

                const sources = ['host', 'index', 'sourcetype'];

                if (sources.includes(k) && !isEmptyOrUndefined(v as string)) {
                    setAtLeastOneSourceProvided(true);
                    hasErrors = true;
                }

                if (k === 'contact') {
                    console.log(
                        'contact is empty or udnefined ::: ',
                        isEmptyOrUndefined(v as string)
                    );
                    if (!isEmptyOrUndefined(v as string)) {
                        if ((v as string).includes(',')) {
                            const validEmailCount = (v as string).split(',').filter((email) => {
                                return isValidEmail(email);
                            });
                            if (
                                (v as string).split(',').length > 0 &&
                                validEmailCount.length !== (v as string).split(',').length
                            ) {
                                setcontactErrorState(true);
                                hasErrors = true;
                            }
                        } else if (!isValidEmail(v)) {
                            setcontactErrorState(true);
                            hasErrors = true;
                        }
                    }
                }

                if (k === 'lateSecs' && isEmptyOrUndefined(v)) {
                    setLateSecsErrorState({
                        ...lateSecsErrorState,
                        empty: true,
                    });
                    hasErrors = true;
                } else if (k === 'lateSecs' && isNaN(v as number)) {
                    setLateSecsErrorState({
                        ...lateSecsErrorState,
                        invalidNumber: true,
                    });
                    hasErrors = true;
                }
            }

            res(hasErrors);
        });
    };

    const submitData = async () => {
        await validate().then((hasErrors) => {
            console.log('FORM ??? ', hasErrors);
            // if (!hasErrors) {
            //     updateRecord(form);
            //     onClose();
            // }
        });
    };

    const updateRecord = (form) => {
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

    const indexHasValue = selectedRowData.index !== undefined && selectedRowData.index !== '';
    const hostHasValue = selectedRowData.host !== undefined && selectedRowData.host !== '';
    const sourcetypeHasValue =
        selectedRowData.sourcetype !== undefined && selectedRowData.sourcetype !== '';

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
                        {indexHasValue ? (
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
                        {hostHasValue ? (
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
                            'Loading'
                        )}
                        {sourcetypeHasValue ? (
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
                                hasError={
                                    lateSecsErrorState.empty || lateSecsErrorState.invalidNumber
                                }
                                type={LATE_SECONDS}
                                setSelected={handleFormChange}
                                value={form.lateSecs}
                            />
                        ) : (
                            'Loading'
                        )}
                        {
                            <ContactInput
                                hasError={contactErrorState}
                                type={CONTACT}
                                setSelected={handleFormChange}
                                value={form.contact}
                            />
                        }
                        {
                            <CommentsTextarea
                                type={COMMENTS}
                                setSelected={handleFormChange}
                                value={form.comments}
                            />
                        }
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
