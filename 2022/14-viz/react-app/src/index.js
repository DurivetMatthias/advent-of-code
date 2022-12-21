import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import React from "react"
import { createRoot } from "react-dom/client"
import {
    BrowserRouter, Route, Routes
} from "react-router-dom"


import {
    BasePageLayout,
    HomePage
} from "./components/Pages"
import { CustomTheme } from "./utils/CustomTheme"

function App() {
    return <React.Fragment>
        <CssBaseline />
        <ThemeProvider theme={CustomTheme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<BasePageLayout />}>
                        <Route path="/" index element={<HomePage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </React.Fragment>
}

const container = document.getElementById("app")
const root = createRoot(container)
root.render(<App />)
