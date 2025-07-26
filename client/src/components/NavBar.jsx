import styles from '../css/AdminNav.module.css';

function Navbar() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>CSULB Routes</h1>
      <nav>
        <ul className={styles.navLinks}> 
          <li><a href='./' onClick="return false;"><button>Home</button></a></li>
          <li><a href='./'><button>About</button></a></li>
          <li><a href='./'><button>Contact Us</button></a></li>
        </ul>
      </nav>
    </header> 
  )
}

export default Navbar
