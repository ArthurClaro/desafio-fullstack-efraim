import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"


function DesafioFullRoutes() {

    return (
        <>
            <Routes >
                <Route path="/" element={<Home />} />
            </Routes>
        </>
    )
}
export default DesafioFullRoutes
