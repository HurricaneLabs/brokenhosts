import React, { useState } from 'react';
import T from 'prop-types';
import Table from '@splunk/react-ui/Table';
import Button from '@splunk/react-ui/Button';
import Heading from '@splunk/react-ui/Heading';
import Text from '@splunk/react-ui/Text';
import Modal from '@splunk/react-ui/Modal';

const EditRecord = ({ remove, update, openState, onClose, selectedRow }) => {
    // pass in the remove and update functions as props
    const [newField1, setNewField1] = useState('');
    const [newField2, setNewField2] = useState('');

    const deleteRepo = () => {
        // delete the record and close the modal
        remove(selectedRow._key);
        onClose();
    };

    const updateRepo = () => {
        // update the record and close the modal
        const currentRow = { ...selectedRow, field1: newField1, field2: newField2 }; // for some reason I needed to do this and I couldn't store in state
        update(selectedRow._key, currentRow);
        setNewField1('');
        setNewField2('');
        onClose();
    };

    return (
        <div>
            <Modal onRequestClose={onClose} open={openState} style={{ width: '500px' }}>
                <Modal.Header onRequestClose={onClose} title="Update Record" />
                <Modal.Body>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>_key</Table.HeadCell>
                            <Table.HeadCell>repo_name</Table.HeadCell>
                            <Table.HeadCell>repo_owner</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            <Table.Row key={selectedRow._key}>
                                <Table.Cell>{selectedRow._key}</Table.Cell>
                                <Table.Cell>{selectedRow.field1}</Table.Cell>
                                <Table.Cell>{selectedRow.field2}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>{' '}
                    <Heading level={4}>Enter field1 Value</Heading>
                    <Text
                        value={newField1}
                        onChange={(e) => {
                            setNewField1((e.target as HTMLInputElement).value);
                        }}
                    />
                    <Heading level={4}>Enter field2 Value</Heading>
                    <Text
                        value={newField2}
                        onChange={(e) => {
                            setNewField2((e.target as HTMLInputElement).value);
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button appearance="default" onClick={onClose} label="Cancel" />
                    <Button appearance="destructive" onClick={deleteRepo} label="Delete Record" />
                    <Button appearance="primary" onClick={updateRepo} label="Submit" />
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
