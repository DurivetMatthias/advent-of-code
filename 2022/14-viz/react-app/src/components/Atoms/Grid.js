import { Box, Stack } from "@mui/material"

const Grid = ({ sx, booleanGrid, trueStyle, falseStyle, height, width }) => {
    return <Stack
        alignItems="center"
        justifyContent="space-between"
        flexDirection="column"
        sx={{
            height: height,
            width: width,
            ...sx,
        }}
    >
        {booleanGrid.map((row, y) => (
            <Stack
                alignItems="center"
                justifyContent="space-between"
                flexDirection="row"
                key={y}
                sx={{
                    height: height / booleanGrid.length,
                    width: width
                }}
            >
                {row.map((value, x) => (
                    <Box
                        key={x}
                        sx={{
                            height: height / booleanGrid.length,
                            width: width / booleanGrid[0].length,
                            ...(value ? trueStyle : falseStyle)
                        }}
                    >
                    </Box>
                ))}
            </Stack>
        ))}
    </Stack>
}

export default Grid
