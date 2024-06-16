import { useForm } from "react-hook-form";
import standartStyles from "@/styles/Styles.module.scss";
import styles from "./Cabinet.module.scss";
import { MdOutlinePassword } from "react-icons/md";
import { toast } from "react-toastify";

export default function ChangePassword({user}){


    const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm({});

    const onSubmit = async (data) => {
		const response = await fetch(`/api/users`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(
				{...data, id: user.id}
			),
		});
		const result = await response.json();
		if (!result.success) {
			toast.error(result.data);
			return;
		} else {
			toast.success('Дані успішно оновлено');
		}
	};


    return(
        <form onSubmit={handleSubmit(onSubmit)} className={standartStyles.form}>
            <p>Змінити пароль</p>
            <fieldset>
            <div>
                <MdOutlinePassword className={styles.icon} />
                <label
                    className={
                        standartStyles.labelForFormElements
                    }>
                    Введіть старий пароль*
                </label>
            </div>
            <input
                className={`${standartStyles.inputRegular}`}
                type="password"
                {...register("oldPassword", {
                    required: "Введіть старий пароль",
                    minLength: {
                        value: 8,
                        message:
                            "Пароль не може бути коротшим за 8 символів",
                    },
                    validate: {
                        hasUpperCase: (value) =>
                            /[A-Z]/.test(value) ||
                            "Пароль повинен містити хоч одну велику літеру",
                        hasLowerCase: (value) =>
                            /[a-z]/.test(value) ||
                            "Пароль повинен містити хоч одну маленьку літеру",
                        hasNumber: (value) =>
                            /\d/.test(value) ||
                            "Пароль повинен містити хоч одну цифру",
                        hasSpecialChar: (value) =>
                            /[!@#$%^&*]/.test(value) ||
                            "Пароль повинен містити хоч один спеціальний символ",
                    },
                })}
            />
            {errors.oldPassword && (
                <span className={styles.errorMessage}>
                    {errors.oldPassword.message}
                </span>
            )}
        </fieldset>
        <fieldset>
            <div>
                <MdOutlinePassword className={styles.icon} />
                <label
                    className={
                        standartStyles.labelForFormElements
                    }>
                    Введіть новий пароль"*
                </label>
            </div>
            <input
                className={`${standartStyles.inputRegular}`}
                type="password"
                {...register("password", {
                    required: "Введіть новий пароль",
                    minLength: {
                        value: 8,
                        message:
                            "Пароль не може бути коротшим за 8 символів",
                    },
                    validate: {
                        hasUpperCase: (value) =>
                            /[A-Z]/.test(value) ||
                            "Пароль повинен містити хоч одну велику літеру",
                        hasLowerCase: (value) =>
                            /[a-z]/.test(value) ||
                            "Пароль повинен містити хоч одну маленьку літеру",
                        hasNumber: (value) =>
                            /\d/.test(value) ||
                            "Пароль повинен містити хоч одну цифру",
                        hasSpecialChar: (value) =>
                            /[!@#$%^&*]/.test(value) ||
                            "Пароль повинен містити хоч один спеціальний символ",
                    },
                })}
            />
            {errors.password && (
                <span className={styles.errorMessage}>
                    {errors.password.message}
                </span>
            )}
        </fieldset>
        <fieldset>
            <div>
                <MdOutlinePassword className={styles.icon} />
                <label
                    className={
                        standartStyles.labelForFormElements
                    }>
                    Повторіть пароль*
                </label>
            </div>
            <input
                className={`${standartStyles.inputRegular}`}
                type="password"
                {...register("repeatPassword", {
                    required: "Повторіть пароль",
                    validate: (value) =>
                        value === watch("password") ||
                        "Паролі не співпадають",
                })}
            />
            {errors.repeatPassword && (
                <span className={styles.errorMessage}>
                    {errors.repeatPassword.message}
                </span>
            )}
        </fieldset>
        <button
                className={standartStyles.buttonRegular}
                type="submit"
                onClick={handleSubmit(onSubmit)}>
                Зберегти
            </button>
    </form>
    );
}