import styles from '../../css/AdminNav.module.css';
import { useNodeManager } from '../../context/NodeManager';

function AdminNav() {

    const {handleUpdateGraph} = useNodeManager();

    return (
        <header className={styles.header}>
            <h1 className={styles.logo}>Admin Utilities</h1>
            <nav>
                <ul className={styles.navLinks}> 
                    <li><a href="/admin/create">Create Route</a></li>
                    <li><a href="/admin/edit">Edit Route</a></li>
                    <li><a href="/admin/delete">Delete Route</a></li>
                    <li><a href="/admin/view">View Routes</a></li>
                </ul>
            </nav>
            <button className={styles.button} onClick={(e) => {handleUpdateGraph(); e.stopPropagation()}}>Update</button>
        </header> 
    )
}

export default AdminNav