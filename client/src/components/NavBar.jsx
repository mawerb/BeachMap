import styles from '../css/AdminNav.module.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className={styles.header}>
      <Link className={styles.logo} to="/">
      <h1>CSULB Routes</h1>
      </Link>
      <nav>
        <ul className={styles.navLinks}>

          <li><Link to='/home#home'><button>Home</button></Link></li>
          <li><Link to='/home#about'><button>About</button></Link></li>
          <li><Link to='/home#contact'><button>Contact Me</button></Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
