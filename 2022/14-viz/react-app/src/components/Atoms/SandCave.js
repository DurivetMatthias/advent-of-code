import React from "react"
import sandGrid from "../../precalculated/sandGrid"
import { colors } from "../../utils/CustomTheme"
import { Grid } from "../Atoms"

const SandCave = ({ sx }) => {
    return <Grid
        sx={sx}
        booleanGrid={sandGrid}
        trueStyle={{ backgroundColor: colors.saffron }}
        falseStyle={{}}
        height={window.innerHeight * 0.8}
        width={window.innerHeight * 0.8 / (sandGrid.length / sandGrid[0].length)}
    />
}

export default SandCave
