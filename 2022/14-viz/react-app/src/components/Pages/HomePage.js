import { Stack } from "@mui/material"
import { colors } from "../../utils/CustomTheme"
import { EmptyCave, SandCave, VersionToggle } from "../Atoms"
import { useVersionState, versionOptions } from "../Atoms/VersionToggle"

const HomePage = () => {
    const { version, setVersion } = useVersionState(versionOptions.example)
    return <Stack justifyContent="center" alignItems="center" sx={{ marginBottom: 1080 }}>
        <VersionToggle version={version} setVersion={setVersion} />
        <EmptyCave sx={{ border: `1x solid ${colors.saffron}` }} />
        <SandCave sx={{ border: `1x solid ${colors.saffron}` }} />
    </Stack>
}

export default HomePage
