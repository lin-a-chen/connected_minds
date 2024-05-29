import Link from 'next/link';
import styles from './ChoicePage.module.scss';

export default function SignUpChoice() {
  return (
    <div className={styles.page}>
        <div>
            <section>
                <Link href="/auth/sign-up/teacher">
                    <div className={styles.image}>
                    <img src="/images/sign-up_teacher.png" alt="Sign up teacher" />
                    </div>
                    <p>Я вчителька або вчитель</p>
                </Link>
            </section>
            <section>
                <Link href="/auth/sign-up/school-child">
                    <div className={styles.image}>
                    <img src="/images/sign-up_school-child.png" alt="Sign up school child" />
                    </div>
                    <p>Я учениця або учень</p>
                </Link>
            </section>
        </div>
        {/* <div>
            <section>
                <Link href="/auth/sign-up/school-staff">
                    <div className={styles.image}>
                    <img src="/images/sign-up_school-staff.png" alt="Sign up school staff" />
                    </div>
                    <p>Я працюю в школі</p>
                </Link>
            </section>
        </div> */}
      
      
    </div>
  );
}
