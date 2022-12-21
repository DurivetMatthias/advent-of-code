import React from "react"
import stoneGrid from "../../precalculated/stoneGrid"
import { colors } from "../../utils/CustomTheme"
import { Grid } from "../Atoms"

const EmptyCave = ({ sx }) => {
    return <Grid
        sx={sx}
        booleanGrid={stoneGrid}
        trueStyle={{ backgroundColor: colors.stoneGrey }}
        falseStyle={{}}
        height={window.innerHeight * 0.8}
        width={window.innerHeight * 0.8 / (stoneGrid.length / stoneGrid[0].length)}
    />
}

export default EmptyCave
