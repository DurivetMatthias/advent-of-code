import {
    Stack, Typography
} from "@mui/material"

import { colors } from "../../utils/CustomTheme"

const Header = () => {
    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ height: 70, marginBottom: 30, borderBottom: `5px dashed ${colors.saffron}` }}
        >
            <Typography variant="h1">
                Advent of Code 2022 - Matthias Durivet
            </Typography>
        </Stack>
    )
}
export default Header
