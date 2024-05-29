import Link from 'next/link';
import styles from './Page.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <section>
        <Link href="/auth/sign-up/institution">
            <div className={styles.image}>
              <img src="/images/sign-up_institution.png" alt="Sign up institution" />
            </div>
            <p>Я хочу зареєструвати навчальний заклад</p>
        </Link>
      </section>
      <section>
        <Link href="/auth/sign-up/choice">
            <div className={styles.image}>
              <img src="/images/sign-up_school-child.png" alt="Sign up school child" />
            </div>
            <p>Я хочу зареєструвати себе</p>
        </Link>
      </section>
    </div>
  );
}
