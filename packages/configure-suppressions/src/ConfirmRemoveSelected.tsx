import React, { useState } from 'react';
import T from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import MessageBar from '@splunk/react-ui/MessageBar';

const ConfirmRemoveSelected = ({ openState, onClose, confirmRemoval, selectedRows }) => {
    const removeRows = () => {
        console.log('remove rows :: ', selectedRows);
        confirmRemoval();
        onClose();
    };

    return (
        <div>
            <Modal onRequestClose={onClose} open={openState} style={{ width: '500px' }}>
                <Modal.Header onRequestClose={onClose} title="Update Record" />
                <Modal.Body>
                    <MessageBar type="warning" onRequestClose={() => {}}>
                        Are you sure you want remove the selected items?
                    </MessageBar>
                </Modal.Body>
                <Modal.Footer>
                    <Button appearance="default" onClick={onClose} label="Cancel" />
                    <Button appearance="destructive" onClick={removeRows} label="Confirm" />
                </Modal.Footer>
            </Modal>
        </div>
    );
};

ConfirmRemoveSelected.propTypes = {
    onClose: T.func,
    selectedRows: T.array,
    openState: T.bool,
    confirmRemoval: T.func,
};
export default ConfirmRemoveSelected;
