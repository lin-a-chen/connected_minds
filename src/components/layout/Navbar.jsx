'use client';

import { useState } from "react";
import styles from "@/styles/layout/Navbar.module.scss";
import Link from "next/link";

export default function NavbarAuthed({ navbarLinks }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const signOutHandler = async () => {
        const response = await fetch(`/api/auth/sign-out`, {
            method: "DELETE",
        });
        const result = await response.json();
        if (result.success) {
            window.location.href = "/";
        } else {
            console.error(result.data);
        }
    };

    return (
        <div className={styles.navbarContainer}>
            <div className={styles.logo}>
                <Link href="/">ConnectedMinds</Link>
            </div>
            <button className={styles.menuButton} onClick={toggleMenu}>
                ☰
            </button>
            <nav className={`${styles.navbar} ${menuOpen ? styles.open : ""}`}>
                <ul>
                    {navbarLinks.map((link) => (
                        <li key={link.text}>
                            <Link href={link.source}>{link.text}</Link>
                        </li>
                    ))}
                    <li>
                        <button
                            className={styles.signOutButton}
                            onClick={signOutHandler}>
                            Вийти
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
