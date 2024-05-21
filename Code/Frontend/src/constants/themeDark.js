import { COLORS } from "./theme";

const themeDark = {
    light: {
        themeDark: 'light',
        color: 'black',
        background: COLORS.white,
        backgroundButton: COLORS.white,
        backgroundTextInput: '#f5f5f5',
        backgroundBorder: COLORS.red,
        backgroundHeader: COLORS.red,
        backgroundBottombuttons: '#ccc',
        backgroundTiles: '#E5E5E5',
        textButton: COLORS.darkGrey,
        backgroundSelectedButton: '#969595',
        textSelectedButton: COLORS.white,
        phone: COLORS.lightBlue
        },
    dark: {
        themeDark: 'dark',
        color: COLORS.white,
        background: COLORS.dark,
        backgroundButton: '#141414',
        backgroundTextInput: '#141414',
        backgroundBorder: COLORS.white,
        backgroundHeader: COLORS.red,
        backgroundBottombuttons: '#101010',
        backgroundTiles: '#363435',
        textButton: COLORS.grey,
        backgroundSelectedButton: "#6e6e6e",
        textSelectedButton: COLORS.dark,
        phone: COLORS.lightBlue
    }
}

export default themeDark;