import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import '@fontsource/work-sans/300.css';
import '@fontsource/work-sans/400.css';
import '@fontsource/work-sans/500.css';
import '@fontsource/work-sans/700.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const config: ThemeConfig = {
    initialColorMode: 'light',
};

const theme = extendTheme({
    config,
    colors: {
        primary: {
            main: '#2d3748',
            50: '#eceef6',
            100: '#cfd6e1',
            200: '#b2bbca',
            300: '#959fb3',
            400: '#7f8aa1',
            500: '#2d3748',
            600: '#5b687f',
            700: '#4a5568',
            800: '#3a4352',
            900: '#2d3748',
        },
        secondary: {
            main: '#685d4a',
            100: '#fff8e1',
            200: '#f9ebd4',
            300: '#eadcc6',
            400: '#c6b9a3',
            500: '#a69985',
            600: '#7c715d',
            700: '#685d4a',
            800: '#483e2c',
            900: '#261e0c',
        },
        light: 'white',
        dark: '#212C30',
        whitesmoke: '#F5F5F5',
    },
    semanticTokens: {
        fonts: {
            heading: `'Inter', 'Work Sans', sans-serif`,
            body: `'Inter', 'Roboto', sans-serif`,
        },
        colors: {
            error: {
                default: 'red.300',
            },
            errorContrast: {
                default: 'whitesmoke',
                _dark: 'whitesmoke',
                _light: 'whitesmoke',
            },
            warning: {
                default: 'yellow.500',
            },
            success: {
                default: 'green.500',
            },
            primary: {
                default: 'primary.main',
                _dark: 'primary.100',
                _light: 'primary.800',
            },
            primaryContrast: {
                default: 'whitesmoke',
                _dark: 'primary.800',
                _light: 'whitesmoke',
            },
            secondary: {
                default: 'secondary.600',
                _dark: 'secondary.100',
                _light: 'secondary.600',
            },
            secondaryContrast: {
                default: 'whitesmoke',
                _dark: 'secondary.600',
                _light: 'whitesmoke',
            },
            muted: {
                default: 'gray',
                _dark: 'darkgray',
                _light: 'gray',
            },
            hover: {
                default: '#eeeeee',
                _dark: '#38454a',
                _light: '#eeeeee',
            },
            currBgColor: {
                default: 'light',
                _dark: 'dark',
                _light: 'light',
            },
        },
    },
});

export default theme;
