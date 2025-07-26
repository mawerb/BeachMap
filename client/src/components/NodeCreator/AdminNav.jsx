import styles from '../../css/AdminNav.module.css';
import { useNodeManager } from '../../context/NodeManager';

function AdminNav() {

    const {
        handleUpdateGraph,
        removeAllNodes
    } = useNodeManager();

    return (
        <header className={styles.header}>
            <h1 className={styles.logo}>Admin Utilities</h1>
            <nav>
                <ul className={styles.navLinks}> 
                    <li><a href='./'><button className="cursor-pointer">Home</button></a></li>
                </ul>
            </nav>
            <button className={styles.button} onClick={(e) => {handleUpdateGraph(); e.stopPropagation()}}>Update</button>
                <button className={styles.danger_button} onClick={removeAllNodes}>Delete All</button>
        </header> 
    )
}

export default AdminNav