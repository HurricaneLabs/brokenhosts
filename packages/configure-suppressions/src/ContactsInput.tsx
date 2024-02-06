import React, { useState } from 'react';
import Text, { TextChangeHandler } from '@splunk/react-ui/Text';
import Heading from '@splunk/react-ui/Heading';
import Tooltip from '@splunk/react-ui/Tooltip';
import { capitalize } from './Helpers';
import { Div } from './BHStyles';

const ContactsInput = ({ type, setSelected }) => {
    const [contacts] = useState<string>();

    const handleChange: TextChangeHandler = (_, { value }) => {
        setSelected(`${type}`, value);
    };

    return (
        <Div $width="400px">
            <Heading level={4}>
                {capitalize(type)} <Tooltip content="Comma delimited list of emails" />
            </Heading>
            <Text canClear type="text" value={contacts} onChange={handleChange} />
        </Div>
    );
};

export default ContactsInput;
