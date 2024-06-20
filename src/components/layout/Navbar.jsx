'use client';

import { useState, useEffect } from "react";
import styles from "@/styles/layout/Navbar.module.scss";
import Link from "next/link";

export default function NavbarAuthed({ navbarLinks }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
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

    useEffect(() => {
        if (menuOpen) {
            const handleRouteChange = () => {
                closeMenu();
            };

            window.addEventListener('popstate', handleRouteChange);
            return () => {
                window.removeEventListener('popstate', handleRouteChange);
            };
        }
    }, [menuOpen]);

    return (
        <div className={styles.navbarContainer}>
            <div className={styles.logo}>
                <Link href="/">ConnectedMinds</Link>
            </div>
            <button className={styles.menuButton} onClick={toggleMenu}>
                ☰
            </button>
            <nav className={`${styles.navbar} ${menuOpen ? styles.open : ""}`}>
                <button className={styles.closeButton} onClick={closeMenu}>
                    ✖
                </button>
                <ul>
                    {navbarLinks.map((link) => (
                        <li key={link.text} onClick={() => {closeMenu(); window.location.href = link.source}} >
                            {link.text}
                            {/* <Link href={link.source} onClick={closeMenu}>{link.text}</Link> */}
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
