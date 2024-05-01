'use client'
import styles from "../../../../styles/main pages/auth/Auth.module.scss";
import ButtonRegular from "@/components/UI/buttons/ButtonRegular";
import { useForm } from "react-hook-form";
import { TbMail, TbPhone, TbUserHexagon, TbCalendar, TbPasswordUser} from "react-icons/tb";
import { ErrorMessage } from 'react-hook-form';
import Link from "next/link";

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

    const handlePasswordChange = (e) => {
        setValue("password", e.target.value);
        if (e.target.value.length < 8) {
          setError("password", { type: "custom", message: "Password must be at least 8 characters" });
        } else {
          clearErrors("password");
        }
      };

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
            <form encType="application/json" className={styles.inputForm} method="POST">
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
                   <div><TbPhone className={styles.icon}/><label>Телефон*</label></div>
                    <input defaultValue="+38(067)9998877" type="tel" placeholder="+38(067)9998877" {...register("phoneNumber", { required: true })}/>
                    {errors.phoneNumber && <span className={styles.errorMessage}>Phone number is invalid</span>}
                </fieldset>
                <fieldset>
                    <div><TbMail className={styles.icon}/><label>Email*</label></div>
                    <input defaultValue="maria.marchenko@mail.com" type="email" placeholder="maria.marienko@mail.com" {...register("email", { required: true })}/>
                    {errors.email && <span className={styles.errorMessage}>Email is invalid</span>}
                </fieldset>
                <fieldset>
                    <label>Пароль*</label>
                    <input onChange={handlePasswordChange} defaultValue="12345678" type="password" {...register("password", { required: true })}/>
                    {errors.password && <span className={styles.errorMessage}>Password is invalid</span>}
                </fieldset>
                <fieldset>
                    <label>Повторіть пароль*</label>
                    <input defaultValue="12345678" type="password" {...register("repeatPassword", { required: true, 
                    validate: (value) =>
                    value === getValues("password") || "Passwords do not match", }, )}/>
                    {errors.repeatPassword && <span className={styles.errorMessage}>Passwords do not match</span>}

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
                {/* <h3>Інформація про законного опікуна:</h3>
                <fieldset>
                    <label>Email*</label>
                    <input defaultValue="maria.marienko@mail.com" type="email" placeholder="maria.marienko@mail.com" name="parentEmail" {...register("parentEmail", { required: true })}/>
                    <span>Якщо опікун вже має акаунт, вказуйте пошту, на яку цей акаунт зареєстровано</span>
                </fieldset>
                <fieldset>
                    <label>Ім'я*</label>
                    <input defaultValue="Марія" placeholder="Марія" name="parentFirstname" {...register("parentFirstname", { required: true })}/>
                </fieldset>
                <fieldset>
                    <label>Прізвище*</label>
                    <input defaultValue="Марієнко" placeholder="Марієнко" name="parentLastname" {...register("parentLastname", { required: true })}/>
                </fieldset>
                <fieldset>
                    <label>По-батькові*</label>
                    <input defaultValue="Маріївна" placeholder="Маріївна" name="parentPaternalName" {...register("parentPaternalName", { required: true })}/>
                </fieldset>
                <fieldset>
                    <label>Телефон*</label>
                    <input defaultValue="+38(067)6665544" type="tel" placeholder="+38(067)6665544" name="parentPhoneNumber" {...register("parentPhoneNumber", { required: true })}/>
                </fieldset> */}
                <ButtonRegular type="submit" onClick={handleSubmit(onSubmit)} label="Зареєструватись"></ButtonRegular>
            </form> 
        </div>     
    );
}

export default sign_up;