import { createTheme } from "@mui/material/styles"

const colors = {
    white: "#FFFFFF",
    black: "#000000",
    saffron: "#FF9933",
    stoneGrey: "#706F6E",
}

// MUI default palette: https://mui.com/material-ui/customization/default-theme/#main-content
const palette = {
    mode: "dark",
    common: {
        black: colors.black,
        white: colors.white,
    },
    primary: {
        main: colors.black,
        contrastText: colors.white
    },
    secondary: {
        main: colors.saffron,
        contrastText: colors.white
    },
    text: {
        primary: colors.white,
    },
    background: {
        default: colors.black,
        paper: colors.black,
    }
}

const typography = {
    h1: {
        fontSize: "2.5rem"
    }
}
const spacing = pxValue => pxValue / 915 * window.innerHeight


const CustomTheme = createTheme({
    palette,
    typography,
    spacing,
})

export { CustomTheme, colors }
