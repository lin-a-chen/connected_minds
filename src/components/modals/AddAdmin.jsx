import styles from "./Popups.module.scss";
import standartStyles from "@/styles/Styles.module.scss"
import { LuMail, LuPhone } from "react-icons/lu";
import { TbId, TbPencilMinus } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { MdOutlinePassword } from "react-icons/md";

export default function AddAdmin({ onClose, isVisible }){
    console.log('i open')
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm();

    const onSubmit = async (data) => {

        const validateResponse = await fetch(`/api/institutions/admin/validate`, {method: "POST", 
        headers: {
            "Content-Type":"application/json"
        }, 
        body: JSON.stringify(data)
        })
        const validateResult = await validateResponse.json();

        if (!validateResult.success){
            toast.error(validateResult.data);
            return;
        }

        const response = await fetch(`/api/institutions/admin`, {method: "POST", 
        headers: {
            "Content-Type":"application/json"
        }, 
        body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!result.success){
            toast.error(result.data);
            return;
        }
        else{
           onClose(); 
        }
    }
    
    return(
        <>
            {isVisible && <div className={`${styles.popupBackdrop} ${styles.noBlur}`}>
                <div className={`${styles.popupWindow} ${styles.errorPopup}`}>
                    <form className={standartStyles.form}>
                    <fieldset>
                    <div>
                        <div className={standartStyles.icon}><TbPencilMinus/></div>
                        <label className={standartStyles.labelForFormElements}>Ім'я*</label>
                    </div>
                    <input
                        defaultValue="Марія"
                        placeholder="Марія"
                        {...register("firstname", { required: "Ім'я не може бути пустим" })}
                    />
                    {errors.firstname && (
                        <span className={styles.errorMessage}>
                        {errors.firstname.message}
                        </span>
                    )}
                    </fieldset>
                    <fieldset>
                    <div>
                        <div className={standartStyles.icon}><TbPencilMinus/></div>
                    <label className={standartStyles.labelForFormElements}>Прізвище*</label>
                    </div>
                    <input
                        defaultValue="Марієнко"
                        placeholder="Марієнко"
                        {...register("lastname", { required: "Прізвище не може бути пустим" })}
                    />
                    {errors.lastname && (
                        <span className={styles.errorMessage}>{errors.lastname.message}</span>
                    )}
                    </fieldset>
                    <fieldset>
                    <div>
                        <div className={standartStyles.icon}><TbPencilMinus/></div>
                    <label className={standartStyles.labelForFormElements}>По-батькові або по-матері*</label>
                    </div><input
                        defaultValue="Маріївна"
                        placeholder="Маріївна"
                        {...register("antroponym", {
                        required: "По матері чи по батькові не може бути пустим",
                        })}
                    />
                    {errors.antroponym && (
                        <span className={styles.errorMessage}>{errors.antroponym.message}</span>
                    )}
                    </fieldset>
                    <fieldset>
                        <div><LuMail className={standartStyles.icon}/><label>Email*</label></div>
                        <input defaultValue="maria.marchenko@mail.com" type="email" placeholder="maria.marienko@mail.com" {...register("email", { required: "Логін обов'язковий",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Формат email невірний"
                        }                         
                    })}/>
                        {errors.email && <span className={standartStyles.errorMessage}>{errors.email.message}</span>}
                    </fieldset>
                    <fieldset>
                    <div>
                        <LuPhone className={styles.icon} />
                        <label className={standartStyles.labelForFormElements}>Телефон*</label>
                    </div>
                    <input
                        defaultValue={"+38(073)333-45-21"}
                        type="tel"
                        className={`${standartStyles.inputRegular}`}
                        placeholder="+38(067)9998877"
                        {...register("phoneNumber", {
                        required: "Ви пропустили номер телефону",
                        pattern: {
                            value: /^\+38\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
                            message: "Формат номеру невірний",
                        },
                        })}
                    />
                    {errors.phoneNumber && (
                        <span className={styles.errorMessage}>
                        {errors.phoneNumber.message}
                        </span>
                    )}
                    </fieldset>
                    <fieldset>
                    <div>
                        <MdOutlinePassword className={styles.icon} />
                        <label className={standartStyles.labelForFormElements}>Пароль*</label>
                    </div>
                    <input
                        className={`${standartStyles.inputRegular}`}
                        type="password"
                        {...register("password", {
                        required: "Ви пропустили пароль",
                        minLength: {
                            value: 8,
                            message: "Пароль не може бути коротшим за 8 символів",
                        },
                        validate: {
                            hasUpperCase: (value) =>
                            /[A-Z]/.test(value) || "Пароль повинен містити хоч одну велику літеру",
                            hasLowerCase: (value) =>
                            /[a-z]/.test(value) || "Пароль повинен містити хоч одну маленьку літеру",
                            hasNumber: (value) => /\d/.test(value) || "Пароль повинен містити хоч одну цифру",
                            hasSpecialChar: (value) =>
                            /[!@#$%^&*]/.test(value) || "Пароль повинен містити хоч один спеціальний символ",
                        },
                        })}
                    />
                    {errors.password && (
                        <span className={styles.errorMessage}>{errors.password.message}</span>
                    )}
                    </fieldset>
                    <fieldset>
                    <div>
                        <MdOutlinePassword className={styles.icon} />
                        <label className={standartStyles.labelForFormElements}>Повторіть пароль*</label>
                    </div>
                    <input
                        className={`${standartStyles.inputRegular}`}
                        type="password"
                        {...register("repeatPassword", {
                        required: "Повторіть пароль",
                        validate: (value) =>
                            value === watch("password") || "Паролі не співпадають",
                        })}
                    />
                    {errors.repeatPassword && (
                        <span className={styles.errorMessage}>{errors.repeatPassword.message}</span>
                    )}
                    </fieldset>
                    <fieldset>
                        <div><TbId className={standartStyles.icon}/><label>Код ЄДЕБО навчального закладу</label></div>
                        <input defaultValue="123456" type="text" {...register("useedCode", { required: false,
                            minLength: {
                                value: 6,
                                message: "Код ЄДЕБО повинен бути довжиною 6 символів"
                            },
                            pattern: {
                                value: /^\d{6}$/,
                                message: "Код ЄДЕБО має складатися лише з цифр"
                            }
                        })}/>
                        {errors.useedCode && <span className={standartStyles.errorMessage}>{errors.useedCode.message}</span>}
                    </fieldset>
                    <div className={styles.buttons}>
                        <button className={standartStyles.buttonSubmit} type="submit" onClick={handleSubmit(onSubmit)} label="Увійти">Призначити</button>
                        <button className={styles.cancel} onClick={onClose}>Відхилити</button>
                    </div>
                    </form>
                </div>
            </div>}
        </>     
    );
}