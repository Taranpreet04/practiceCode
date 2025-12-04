import { Outlet } from "react-router-dom"
import Header from "./common/header"
import Footer from "./common/footer"

function MainLayout() {
    return (
        <div className="container">
            <div className="row" style={{height: "10vh"}}>
                <div className="col-md-12">
                    {/* <Header /> */}
                </div>
            </div>
            <div className="row" >
                <div className="col-md-12">
                    <Outlet />
                </div>
            </div>
            <div className="row" style={{height: "10vh"}}>
                <div className="col-md-12">
                    {/* <Footer /> */}
                </div>
            </div>

        </div>
    )
}
export default MainLayout