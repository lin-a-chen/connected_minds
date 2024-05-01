'use client'
import styles from "../../styles/layout/NavbarUnauthed.module.scss";
import Link from 'next/link';
// import { redirect } from "next/navigation";

const NavbarAuthed = () =>{

    const signOutHandler = async () => {
        const response = await fetch(`/api/auth/sign-out`, {method: "DELETE"});
        console.log('resuuult', response)

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
                        <Link href="/profile">Профіль</Link>
                    </li>
                    <li>
                        <Link href="/contacts">Чати</Link>
                    </li>
                    <li>
                        <input type="button" onClick={signOutHandler} value="Вийти"/>
                    </li>
                </ul>   
            </nav>
        </div>
        
    );
}

export default NavbarAuthed;