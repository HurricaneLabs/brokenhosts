import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SuppressionTable from './SuppressionTable';

import { StyledContainer } from './ConfigureSuppressionsStyles';

const propTypes = {
    name: PropTypes.string,
};

const ConfigureSuppressions = () => {
    return <SuppressionTable />;
};

ConfigureSuppressions.propTypes = propTypes;

export default ConfigureSuppressions;
