import { ToggleButton, ToggleButtonGroup } from "@mui/material"
import React from "react"

import { puzzleInputs } from "../../utils/PuzzleInputs"

const versionOptions = Object.keys(puzzleInputs[14]).reduce((result, key) => ({
    ...result,
    [key]: key,
}), {})

const useVersionState = initialValue => {
    const [version, setVersion] = React.useState(initialValue)
    return {
        version,
        setVersion,
    }
}

const VersionToggle = ({ version, setVersion }) => {
    return <ToggleButtonGroup
        value={version}
        exclusive
        onChange={event => setVersion(event.target.value)}
    >
        {Object.values(versionOptions).map(version => (
            <ToggleButton value={version} key={version}>
                {version}
            </ToggleButton>
        ))}
    </ToggleButtonGroup>
}

export default VersionToggle
export {
    useVersionState,
    versionOptions,
}
