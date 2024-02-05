import React from 'react';

import layout from '@splunk/react-page';
import ConfigureSuppressions from '@splunk/configure-suppressions';
import { getUserTheme } from '@splunk/splunk-utils/themes';

import { StyledContainer } from './StartStyles';

getUserTheme()
    .then((theme) => {
        layout(
            <StyledContainer>
                <ConfigureSuppressions />
            </StyledContainer>,
            {
                theme,
            }
        );
    })
    .catch((e) => {
        const errorEl = document.createElement('span');
        errorEl.innerHTML = e;
        document.body.appendChild(errorEl);
    });
