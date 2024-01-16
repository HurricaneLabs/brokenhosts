import React from 'react';

import layout from '@splunk/react-page';
import ConfigureHostsLookup from '@splunk/configure-hosts-lookup';
import { getUserTheme } from '@splunk/splunk-utils/themes';

import { StyledContainer } from './StartStyles';

getUserTheme()
    .then((theme) => {
        layout(
            <StyledContainer>
                <ConfigureHostsLookup name="from inside ConfigureHostsLookup" />
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
