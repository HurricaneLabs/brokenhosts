import styled from 'styled-components';
import { variables, mixins } from '@splunk/themes';
import Button from '@splunk/react-ui/Button';

export const Flex = styled.div<{ $width?: string; $gap?: string }>`
    display: flex;
    flex-direction: row;
    gap: ${(props) => props.$gap || '10px'};
    width: ${(props) => props.$width || '100%'};
`;

export const Div = styled.div<{ $width?: string }>`
    width: ${(props) => props.$width || '100%'};
`;

export const FlexItem = styled.div`
    align-self: flex-start;
    margin: 0 0;
`;

export const SmallButtonTheme = {
    lineHeight: '11px',
    minHeight: '31px',
    height: '0',
};
