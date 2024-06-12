import styles from "./Popups.module.scss";
import standartStyles from "@/styles/Styles.module.scss"
import { LuMail, LuPhone, LuBaby } from "react-icons/lu";
import { TbId, TbPencilMinus } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { MdOutlinePassword } from "react-icons/md";

export default function AddSubject({ onClose, isVisible }){
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm();

    const onSubmit = async (data) => {

        const validateResponse = await fetch(`/api/institution/subjects/validate`, {method: "POST", 
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

        const response = await fetch(`/api/institution/subjects`, {method: "POST", 
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
                        <label className={standartStyles.labelForFormElements}>Назва предмету*</label>
                    </div>
                    <input
                        defaultValue="Біологія"
                        placeholder="Біологія"
                        {...register("subjectName", { required: "Назва не може бути пустою" })}
                    />
                    {errors.subjectName && (
                        <span className={styles.errorMessage}>
                        {errors.subjectName.message}
                        </span>
                    )}
                    </fieldset>
                    <fieldset>
                    <div>
                    <div className={standartStyles.icon}><LuBaby/></div>
                        <label className={standartStyles.labelForFormElements}>Предмет для*</label>
                    </div>
                    <div className={styles.radioButtonWithLabelAndIcon}>
                        <div><input
                        defaultChecked={true}
                        type="radio"
                        value="Молодшу школу"
                        id={'primarySchoolRadioButton'}
                        {...register("classesType", { required: "Це поле обов'язкове" })}
                        /></div>
                        <label htmlFor={'primarySchoolRadioButton'}>Молодшої школи</label>
                    </div>
                    <div className={styles.radioButtonWithLabelAndIcon}>
                    <div><input
                        type="radio"
                        value="Старшу школу"
                        id={'highSchoolRadioButton'}
                        {...register("classesType", { required: "Це поле обов'язкове" })}
                        /></div>
                        <label htmlFor={'highSchoolRadioButton'}>Старшої школи</label>
                    </div>
                    {errors.classesType && (
                        <span className={styles.errorMessage}>{errors.classesType.message}</span>
                    )}
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