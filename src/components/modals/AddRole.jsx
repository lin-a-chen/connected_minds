import styles from "./Popups.module.scss";
import standartStyles from "@/styles/Styles.module.scss"
import { LuMail } from "react-icons/lu";
import { TbId } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import { useState } from "react";

export const AddRole = ({ onClose, isVisible }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {

        const validateResponse = await fetch(`/api/roles/user-roles/validate`, {method: "POST", 
        headers: {
            "Content-Type":"application/json"
        }, 
        body: JSON.stringify(data)
        })
        const validateResult = await validateResponse.json();

        if (!validateResult.success){
            toast.error(validateResult.data)
        }
        else{
            const response = await fetch(`/api/roles/user-roles`, {method: "POST", 
            headers: {
                "Content-Type":"application/json"
            }, 
            body: JSON.stringify(data)
            });
            const result = await response.json();
            onClose();
        }

        
    }
    return(
        <>
            {isVisible && <div className={`${styles.popupBackdrop} ${styles.noBlur}`}>
                <div className={`${styles.popupWindow} ${styles.errorPopup}`}>
                    `<form className={standartStyles.form}>
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
                            <div><TbId className={standartStyles.icon}/><label>Роль користувача*</label></div>
                            <select {...register("userRole", { required: "Вказання назви ролі обов'язкове"})}>
                                <option value=''>Оберіть роль</option>
                                <option value='INSTITUTION_ADMIN'>Керівник НЗ</option>
                                <option value='SCHOOLCHILD'>Учень</option>
                                <option value='TEACHER'>Вчитель</option>
                            </select>
                            {errors.userRole && <span className={standartStyles.errorMessage}>{errors.userRole.message}</span>}
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
                        <button type="submit" onClick={handleSubmit(onSubmit)} label="Увійти">Призначити роль</button>
                        <button className={styles.cancel} onClick={onClose}>Відхилити</button>
                    </div>
                    </form>
                </div>
            </div>}
        </>     
    );
}