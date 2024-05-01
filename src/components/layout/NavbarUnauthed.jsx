import styles from "../../styles/layout/NavbarUnauthed.module.scss";
import Link from 'next/link';

const NavbarUnauthed = () =>{
        return(
        <div className={styles.navbarUnauthedContainer}>
            <div className={styles.logo}><Link href="/">ConnectedMinds</Link></div>
            <nav className={styles.navbarUnauthed}>
                <ul>
                    <li>
                        <Link href="/about">Про нас</Link>
                    </li>
                    <li>
                        <Link href="/contacts">Контакти</Link>
                    </li>
                    <li>
                        <Link href="/auth/sign-in">Увійти</Link>
                    </li>
                    <li>
                        <Link href="/auth/sign-up">Зареєструватись</Link>
                    </li>
                </ul>   
            </nav>
        </div>
        
    );
}

export default NavbarUnauthed;