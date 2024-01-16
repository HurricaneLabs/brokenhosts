import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@splunk/react-ui/Button';
import BHTable from './BHTable';

const propTypes = {
    name: PropTypes.string,
};

const ConfigureHostsLookup = () => {
    // const [counter, setCounter] = useState(0);

    return <BHTable />;
};

ConfigureHostsLookup.propTypes = propTypes;

export default ConfigureHostsLookup;
