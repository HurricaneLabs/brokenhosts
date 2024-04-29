import React, { useState, useEffect } from 'react';
import Text, { TextChangeHandler } from '@splunk/react-ui/Text';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Heading from '@splunk/react-ui/Heading';
import Tooltip from '@splunk/react-ui/Tooltip';
import { capitalize } from '../Helpers';
import { Div } from '../BHStyles';

interface Props {
    type: string;
    setSelected: (type: string, value: string) => void;
    value?: string;
}

const ContactInput = ({ type, setSelected, value: valueProps }: Props) => {
    const [contact, setContacts] = useState<string>();

    const handleChange: TextChangeHandler = (_, { value }) => {
        setContacts(value);
        setSelected(type, value);
    };

    useEffect(() => {
        if (typeof valueProps !== 'undefined') {
            setContacts(valueProps);
            setSelected(type, valueProps);
        }
    }, [valueProps]);

    return (
        <Div $width="400px">
            <ControlGroup
                label={capitalize(type)}
                labelPosition="top"
                style={{ margin: '.5em .25em 0 0' }}
            >
                <Text canClear type="text" value={contact || ''} onChange={handleChange} />
                <Tooltip content="Comma delimited list of emails" />
            </ControlGroup>
        </Div>
    );
};

export default ContactInput;
