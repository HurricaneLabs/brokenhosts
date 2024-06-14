import React from 'react';
import PropTypes from 'prop-types';
import BHTable from './BHTable';

const propTypes = {
    name: PropTypes.string,
};

const ConfigureSuppressions = () => {
    // const [counter, setCounter] = useState(0);

    return <BHTable />;
};

ConfigureSuppressions.propTypes = propTypes;

export default ConfigureSuppressions;
