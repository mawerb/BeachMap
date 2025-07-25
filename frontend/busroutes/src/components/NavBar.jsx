import styles from '../css/AdminNav.module.css';

function Navbar() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>Admin Utilities</h1>
      <nav>
        <ul className={styles.navLinks}> 
          <li><a href='./'><button>Home</button></a></li>
        </ul>
      </nav>
      <button className={styles.button} onClick={(e) => e.stopPropagation()}>
        Update
      </button>
      <button className={styles.danger_button}>
        Delete All
      </button>
    </header> 
  )
}

export default Navbar
