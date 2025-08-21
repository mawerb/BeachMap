import { Link } from 'react-router-dom';

function Navbar() {

  console.log(window.innerWidth)
  return (
    <header className="absolute w-full z-[1000] flex justify-end items-center px-[5%] py-2 bg-[#ECAA00]">
      <Link 
        className="mr-auto cursor-pointer text-white" 
        to="/"
      >
        <h1 className="font-bold text-sm md:text-lg">CSULB Routes</h1>
      </Link>
      
      <nav>
        <ul className="list-none text-xs md:text-base flex gap-5">
          <li>
            <Link to='/home#home'>
              <button className="text-[#edf0f1] font-medium transition-all duration-300 ease-out hover:text-[#0088A9] font-['Montserrat']">
                Home
              </button>
            </Link>
          </li>
          <li>
            <Link to='/home#about'>
              <button className="text-[#edf0f1] font-medium transition-all duration-300 ease-out hover:text-[#0088A9] font-['Montserrat']">
                About
              </button>
            </Link>
          </li>
          <li>
            <Link to='/home#contact'>
              <button className="text-[#edf0f1] font-medium transition-all duration-300 ease-out hover:text-[#0088A9] font-['Montserrat']">
                Contact Me
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar