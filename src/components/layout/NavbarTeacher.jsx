'use client'
import styles from "@/styles/layout/NavbarUnauthed.module.scss";
import Link from 'next/link';
import { LuUser } from "react-icons/lu";

const NavbarTeacher = () =>{

    const signOutHandler = async () => {
        const response = await fetch(`/api/auth/sign-out`, {method: "DELETE"});

        const result = await response.json();
        if (result.success) {
            window.location.href = '/';
        } else {
            console.error(result.data);
        }
    }
        return(
        <div className={styles.navbarUnauthedContainer}>
            <div className={styles.logo}><Link href="/">ConnectedMinds</Link></div>
            <nav className={styles.navbarUnauthed}>
                <ul>
                    <li>
                        <Link href="/cabinet/teacher/academic-records">Журнал оцінок</Link>
                    </li>
                    <li>
                        <Link href="/cabinet/teacher/schedule">Розклад класів</Link>
                    </li>
                    <li>
                        <Link href="/cabinet/teacher"><LuUser/></Link>
                    </li>
                    <li>
                        <input type="button" onClick={signOutHandler} value="Вийти"/>
                    </li>
                </ul>   
            </nav>
        </div>
        
    );
}

export default NavbarTeacher;
