import DropDown from "../components/Dropdown";
import Navbar from "../components/NavBar";

const Tester = () => {
    return(
        <>
            <Navbar/>
            <main className="pt-[50px]">
                <div className="flex">
                    <DropDown/>
                </div>
            </main>
        </>
    )
}

export default Tester