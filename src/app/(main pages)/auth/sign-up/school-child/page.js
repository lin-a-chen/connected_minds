'use client'
import Link from "next/link";
import { useForm } from "react-hook-form";

import standartStyles from "@/styles/Styles.module.scss";
import styles from "@/styles/main pages/auth/Auth.module.scss";

import { LuMail, LuPhone } from "react-icons/lu";
import { MdOutlinePassword, MdOutlineAddLocationAlt } from "react-icons/md";
import { TbMail, TbPhone, TbUserHexagon, TbCalendar, TbPasswordUser, TbCodeAsterisk, TbLink, TbUserDollar, TbSchool, TbPencilMinus } from "react-icons/tb";

const sign_up = () => {
    const classLetters = ['А', 'Б', 'В', 'Г'];

    const onSubmit = async(data) => {
        const response = await fetch('/api/auth/sign-up', {method: "POST", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            window.location.href = '/';
        } else {
            console.error(result.data);
        }
    }

    const {
        register,
        handleSubmit,
        watch,
        getValues,
        formState: { errors },
    } = useForm();

    return(
        <div className={styles.authPage}>
            <div>
                <div className={styles.logo}>
                    <img src="\images\Logo.svg"></img><h1>ConnectedMinds</h1>
                </div>
                <h3>Маєш акаунт?</h3>
                <Link className={styles.link} href="/auth/sign-in">Увійти</Link>
            </div>
            <form encType="application/json" className={standartStyles.form} method="POST">
                <fieldset>
                    <label>Ім'я*</label>
                    <input defaultValue="Тетяна" placeholder="Тетяна" {...register("firstname", { required: true })}/>
                    {errors.firstname && <span className={styles.errorMessage}>Firstname is invalid</span>}
                </fieldset>
                <fieldset>
                    <label>Прізвище*</label>
                    <input defaultValue="Тетяненко" placeholder="Тетяненко" {...register("lastname", { required: true })}/>
                    {errors.lastname && <span className={styles.errorMessage}>Lastname is invalid</span>}
                </fieldset>
                <fieldset>
                    <label>По-батькові*</label>
                    <input defaultValue="Тетянівна" placeholder="Тетянівна" {...register("paternalName", { required: true })}/>
                    {errors.paternalName && <span className={styles.errorMessage}>Paternal name is invalid</span>}
                </fieldset>
                <fieldset>
                    <div><TbCalendar className={styles.icon}/><label>Дата народження*</label></div>
                    <input type="date" placeholder="01/01/1970" {...register("birthdayDate", { required: true })}/>
                    {errors.birthdayDate && <span className={styles.errorMessage}>Birthday date is invalid</span>}
                </fieldset>
                <fieldset>
                    <div><LuPhone className={styles.icon} /><label>Телефон*</label></div>
                        <input type="tel" className={`${standartStyles.inputRegular}`} placeholder="+38(067)9998877" {...register("phoneNumber", { required: "Ви пропустили номер телефону",
                            pattern: {
                                value: /^\+38\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
                                message: "Формат номеру невірний"
                            }
                        })} />
                    {errors.phoneNumber && <span className={styles.errorMessage}>{errors.phoneNumber.message}</span>}
                </fieldset>
                <fieldset>
                    <div><TbMail className={styles.icon}/><label>Email*</label></div>
                    <input defaultValue="maria.marchenko@mail.com" type="email" placeholder="maria.marienko@mail.com" {...register("email", { required: true })}/>
                    {errors.email && <span className={styles.errorMessage}>Email is invalid</span>}
                </fieldset>
                <fieldset>
                    <div><MdOutlinePassword className={styles.icon} /><label>Пароль*</label></div>
                    <input className={`${standartStyles.inputRegular}`} type="password" {...register("password", { required: "Ви пропустили пароль",
                        minLength: {
                            value: 8,
                            message: "Пароль не може бути коротшим за 8 символів"
                        },
                        validate: {
                            hasUpperCase: value => /[A-Z]/.test(value) || "Пароль повинен містити хоч одну велику літеру",
                            hasLowerCase: value => /[a-z]/.test(value) || "Пароль повинен містити хоч одну маленьку літеру",
                            hasNumber: value => /\d/.test(value) || "Пароль повинен містити хоч одну цифру",
                            hasSpecialChar: value => /[!@#$%^&*]/.test(value) || "Пароль повинен містити хоч один спеціальний символ"
                        }
                    })} />
                    {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
                </fieldset>
                <fieldset>
                    <div><MdOutlinePassword className={styles.icon} /><label>Повторіть пароль*</label></div>
                    <input className={`${standartStyles.inputRegular}`} type="password" {...register("repeatPassword", {
                        required: "Повторіть пароль",
                        validate: (value) => value === watch("password") || "Паролі не сходяться",
                    })} />
                    {errors.repeatPassword && <span className={styles.errorMessage}>{errors.repeatPassword.message}</span>}
                </fieldset>
                <fieldset>
                    <label>Клас</label>
                    <div>
                        <input defaultValue="8" type="number" min="1" max="11" placeholder="8" {...register("classNumber", { required: true })}/>
                        {errors.classNumber && <span className={styles.errorMessage}>Classnumber is invalid</span>}
                        <select name="classLetter" {...register("classLetter", { required: true })}>
                            {classLetters && classLetters.map(letter => (
                                <option key={Math.random()} value={letter}>{letter}</option>
                            ))}
                        </select>
                        {errors.classLetter && <span className={styles.errorMessage}>Classletter is invalid</span>}
                    </div>
                    
                </fieldset>
                <button type="submit" onClick={handleSubmit(onSubmit)}>Зареєструватись</button>
            </form> 
        </div>     
    );
}

export default sign_up;