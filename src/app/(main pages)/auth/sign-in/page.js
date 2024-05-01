'use client'
import styles from "../../../../styles/main pages/auth/Auth.module.scss";
import ButtonRegular from "@/components/UI/buttons/ButtonRegular";
import { useForm } from "react-hook-form";
import { TbMail, TbPasswordUser} from "react-icons/tb";
import Link from "next/link";

const sign_in = () => {
    const onSubmit = async(data) => {        
        const response = await fetch('/api/auth/sign-in', {method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            window.location.href = '/';
        } else if(response.status === 400){
            setError("password", { type: "custom", message: "Пароль невірний" });
        } else {
            setError("email", { type: "custom", message: "Email невірний або користувач не існує" });
        }
    }
    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
    } = useForm();

    return(
        <div className={styles.authPage}>
            <div>
                <div className={styles.logo}>
                    <img src="\images\Logo.svg"></img><h1>ConnectedMinds</h1>
                </div>
                <h3>Ще немає акаунту?</h3>
                <Link className={styles.link} href="/auth/sign-up">Зареєструйся зараз</Link>
            </div>
            <form encType="application/json" className={styles.inputForm} method="POST">
                <fieldset>
                    <div><TbMail className={styles.icon}/><label>Email*</label></div>
                    <input defaultValue="maria.marchenko@mail.com" type="email" placeholder="maria.marienko@mail.com" {...register("email", { required: true })}/>
                    {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
                </fieldset>
                <fieldset>
                    <div><TbPasswordUser className={styles.icon}/><label>Пароль*</label></div>
                    <input defaultValue="12345678" type="password" {...register("password", { required: true })}/>
                    {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
                </fieldset>
                <ButtonRegular type="submit" onClick={handleSubmit(onSubmit)} label="Увійти"></ButtonRegular>
            </form> 
        </div>     
    );
}

export default sign_in;