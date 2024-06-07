'use client'
import authStyles from "@/styles/main pages/Auth.module.scss";
import { useForm } from "react-hook-form";
import { TbMail, TbPasswordUser} from "react-icons/tb";
import Link from "next/link";
import standartStyles from '@/styles/Styles.module.scss';

const signIn = () => {
    const onSubmit = async(data) => {       
        console.log('hi'); 
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
        <div className={authStyles.authPage}>
            <div>
                <div className={authStyles.logo}>
                    <img src="\images\Logo.svg"></img><h1>ConnectedMinds</h1>
                </div>
                <h3>Ще немає акаунту?</h3>
                <Link className={authStyles.link} href="/auth/sign-up">Зареєструйся зараз</Link>
            </div>
            <form encType="application/json" className={standartStyles.form} method="POST">
                <fieldset>
                    <div><TbMail className={standartStyles.icon}/><label>Email*</label></div>
                    <input defaultValue="maria.marchenko@mail.com" type="email" placeholder="maria.marienko@mail.com" {...register("email", { required: "Пошта обов'язкова",
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Формат email невірний"
                    }})}/>
                    {errors.email && <span className={standartStyles.errorMessage}>{errors.email.message}</span>}
                </fieldset>
                <fieldset>
                    <div><TbPasswordUser className={standartStyles.icon}/><label>Пароль*</label></div>
                    <input defaultValue="12345678" type="password" {...register("password", { required: "Пароль обов'язковий" })}/>
                    {errors.password && <span className={standartStyles.errorMessage}>{errors.password.message}</span>}
                </fieldset>
                <button className={standartStyles.buttonSubmit} type="submit" onClick={handleSubmit(onSubmit)} label="Увійти">Увійти</button>
            </form> 
        </div>     
    );
}

export default signIn;
