import { extendTheme, ThemeConfig } from '@chakra-ui/react';

// brainlife design language, shared with landing-next (features/LandingV3/landing-v3.css)
// and brainlife-lite (src/themeMui.ts). Fonts come from next/font in app/layout.tsx,
// which sets --font-dm-sans and --font-geist-mono on <html>.

const config: ThemeConfig = {
    initialColorMode: 'system',
    useSystemColorMode: true,
};

const fontSans = `var(--font-dm-sans), 'DM Sans', system-ui, sans-serif`;
const fontMono = `var(--font-geist-mono), 'Geist Mono', ui-monospace, Menlo, monospace`;

const theme = extendTheme({
    config,
    fonts: {
        heading: fontSans,
        body: fontSans,
        mono: fontMono,
    },
    colors: {
        // site palette (landing-next/public/brand/README.md)
        brand: {
            blue: '#005981',
            lightBlue: '#3b9fd0',
            teal: '#2ab0a0',
            red: '#a9262c',
            orange: '#e57536',
            yellow: '#f9c926',
        },
        // app primary: #3d6a92 in light mode, #3b9fd0 in dark mode
        primary: {
            main: '#3d6a92',
            50: '#eef3f8',
            100: '#d3e0ec',
            200: '#b0c8dd',
            300: '#8aadcb',
            400: '#3b9fd0',
            500: '#3d6a92',
            600: '#355d80',
            700: '#2c4e6b',
            800: '#233e55',
            900: '#1a2e40',
        },
        light: '#f7f8f6',
        dark: '#07131c',
        whitesmoke: '#eff2ee',
    },
    semanticTokens: {
        colors: {
            bg: { default: '#f7f8f6', _dark: '#07131c' },
            surface: { default: '#ffffff', _dark: '#0b1f2d' },
            ink: { default: '#1d2230', _dark: '#eef3f6' },
            band: { default: '#eff2ee', _dark: '#0a1a25' },
            line: { default: '#c9cfd6', _dark: 'rgba(238, 243, 246, 0.18)' },
            error: { default: '#d0494f' },
            errorContrast: { default: '#ffffff' },
            warning: { default: '#c9a94f', _dark: '#d9bf6a' },
            success: { default: '#5fa86b' },
            info: { default: '#3b9fd0' },
            primary: { default: '#3d6a92', _dark: '#3b9fd0' },
            primaryContrast: { default: '#ffffff', _dark: '#0b1a24' },
            secondary: { default: '#8f99a5', _dark: '#a8b3c2' },
            secondaryContrast: { default: '#ffffff', _dark: '#1e252e' },
            muted: { default: '#5a6273', _dark: '#a9bac6' },
            hover: { default: '#eff2ee', _dark: 'rgba(238, 243, 246, 0.06)' },
            currBgColor: { default: '#f7f8f6', _dark: '#07131c' },
        },
    },
    styles: {
        global: {
            body: { bg: 'bg', color: 'ink', fontWeight: 400 },
            a: { color: 'primary' },
            'code, kbd, pre': { fontFamily: 'mono' },
        },
    },
    components: {
        // sentence case and light weights, like brainlife-lite buttons
        Button: {
            baseStyle: { fontWeight: 400, textTransform: 'none' },
            defaultProps: { size: 'sm' },
        },
        Heading: {
            baseStyle: { fontWeight: 600, letterSpacing: '-0.02em' },
        },
    },
});

export default theme;
