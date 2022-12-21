import { Stack } from "@mui/material"
import React from "react"
import { Outlet } from "react-router-dom"

import { Header } from "../Atoms"

const BasePageLayout = () => {
    return <React.Fragment>
        <Header />
        <Stack>
            <Outlet />
        </Stack>
    </React.Fragment>
}

export default BasePageLayout
