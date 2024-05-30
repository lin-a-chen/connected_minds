'use client'
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect} from "react";
import AutocompleteInput from "@/components/UI/AutocompleteInput/AutocompleteInput";

import standartStyles from "@/styles/Styles.module.scss";
import styles from "@/styles/main pages/auth/Auth.module.scss";

import { LuMail, LuPhone, LuSchool } from "react-icons/lu";
import { MdOutlinePassword, MdOutlineAddLocationAlt } from "react-icons/md";
import { TbMail, TbPhone, TbUserHexagon, TbCalendar, TbPasswordUser, TbCodeAsterisk, TbLink, TbUserDollar, TbSchool, TbPencilMinus } from "react-icons/tb";
import Search from "@/components/UI/AutocompleteInput/Search";

const sign_up = () => {
    const classLetters = ['А', 'Б', 'В', 'Г'];
    const [regions, setRegions] = useState([]);
    const [region, setRegion] = useState(null);
    const [settlements, setSettlements] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [institutions, setInstitutions] = useState([]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        control,
        setValue
    } = useForm();

    const fetchRegions = async () => {
        const response = await fetch(`/api/settlements`, { method: "GET" });
        const result = await response.json();
        if (result.success) {
            setRegions(result.data);
        } else {
            console.error(result.data);
        }
    };

    const handleRegionSelection = (e) => {
        setRegion(e.target.value);
    }

    useEffect(() => {
        fetchRegions();
    }, []);

    useEffect(() => {
        if (region){
            const fetchSettlements = async () => {
                const response = await fetch(`/api/settlements?region=${region}`);
                const result = await response.json();
                if (result.success) {
                    const settlements = result.data.map(el => `${el.category} ${el.name} (${el.district})`);
                    setSettlements(settlements);
                } else {
                    console.error(result.data);
                }
            };
            fetchSettlements();
        }
        
    }, [region]);

    useEffect(() => {
        const fetchInstitutions = async () => {
            const response = await fetch(`/api/institutions`);
            const result = await response.json();
            if (result.success) {
                setInstitutions(result.data);
            } else {
                console.error(result.data);
            }
        };
        fetchInstitutions();
        
    }, []);

    const today = new Date();
    const minDate = new Date(today.getFullYear() - 19, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate()).toISOString().split('T')[0];


    const submitionHandler = async(data) => {
        // console.log('data', data)
        const response = await fetch('/api/auth/sign-up/school-child', {method: "POST", 
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

    return(
        <div className={styles.authPage}>
            <div>
                <div className={styles.logo}>
                    <img src="\images\Logo.svg"></img><h1>ConnectedMinds</h1>
                </div>
                <h3>Маєш акаунт?</h3>
                <Link className={styles.link} href="/auth/sign-in">Увійти</Link>
            </div>
            <form onSubmit={handleSubmit(submitionHandler)} encType="application/json" className={standartStyles.form} method="POST">
                <fieldset>
                    <label>Ім'я*</label>
                    <input defaultValue="Тетяна" placeholder="Тетяна" {...register("firstname", { required: 'Ім\'я не може бути пустим' })}/>
                    {errors.firstname && <span className={styles.errorMessage}>{errors.firstname.message}</span>}
                </fieldset>
                <fieldset>
                    <label>Прізвище*</label>
                    <input defaultValue="Тетяненко" placeholder="Тетяненко" {...register("lastname", { required: 'Прізвище не може бути пустим' })}/>
                    {errors.lastname && <span className={styles.errorMessage}>{errors.lastname.message}</span>}
                </fieldset>
                <fieldset>
                    <label>По-батькові*</label>
                    <input defaultValue="Тетянівна" placeholder="Тетянівна" {...register("antroponym", { required: 'По матері чи по батькові не може бути пустим' })}/>
                    {errors.antroponym && <span className={styles.errorMessage}>{antroponym.lastname.message}</span>}
                </fieldset>
                <fieldset>
                    <div><TbCalendar className={styles.icon}/><label>Дата народження*</label></div>
                    <input type="date" placeholder="01/01/1970" {...register("birthDate", { required: 'Дата народження не може бути пустою',
                    validate: {
                        validAgeRange: (value) => {
                            return (value >= minDate && value <= maxDate) || `Якщо ви учениця чи учень, то ваш вік від 5 до 19 років`;
                          }
                    }})}/>
                    {errors.birthdayDate && <span className={styles.errorMessage}>{errors.birthdayDate.message}</span>}
                </fieldset>
                <fieldset>
                    <div><LuPhone className={styles.icon} /><label>Телефон*</label></div>
                        <input defaultValue={'+38(073)333-45-21'} type="tel" className={`${standartStyles.inputRegular}`} placeholder="+38(067)9998877" {...register("phoneNumber", { required: "Ви пропустили номер телефону",
                            pattern: {
                                value: /^\+38\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
                                message: "Формат номеру невірний"
                            }
                        })} />
                    {errors.phoneNumber && <span className={styles.errorMessage}>{errors.phoneNumber.message}</span>}
                </fieldset>
                <fieldset>
                    <div><TbMail className={styles.icon}/><label>Email*</label></div>
                    <input defaultValue="ipz202_bro@student.ztu.edu.ua" type="email" placeholder="maria.marienko@mail.com" {...register("email", { required: 'Ви пропустили email', 
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Формат email невірний"
                    }  })}/>
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
                        <input defaultValue="8" type="number" min="1" max="11" placeholder="8" {...register("classNumber", { required: 'Номер класу не може бути пустим',
                            min: {
                                value: 1,
                                message: 'Не буває класів менше ніж 1'
                            }, max: {
                                value: 12,
                                message: 'Не буває класів більше ніж 12'
                            }
                            })}/>
                        <select defaultValue={''} {...register("classLetter", { required: 'Літера класу не може бути пустою' })}>
                            <option value={''}>Оберіть літеру класу</option>
                            {classLetters && classLetters.map((letter, index) => (
                                <option key={index} value={letter}>{letter}</option>
                            ))}
                        </select>
                        {errors.classNumber && <span className={styles.errorMessage}>{errors.classNumber.message}</span>}
                        {errors.classLetter && <span className={styles.errorMessage}>{errors.classLetter.message}</span>}
                    </div>
                </fieldset>
                <fieldset>
                        <div><MdOutlineAddLocationAlt className={styles.icon} /><label>Область*</label></div>
                        <select className={`${standartStyles.selectRegular}`} {...register("region", { required: "Область обов'язкова" })} onChange={handleRegionSelection}>
                            <option value="">Оберіть область</option>
                            {regions && regions.map((el, index) => (
                                <option key={index} value={el}>{el}</option>
                            ))}
                        </select>
                        {errors.region && <span className={standartStyles.errorMessage}>{errors.region.message}</span>}
                    </fieldset>
                    <fieldset>
                        <div><MdOutlineAddLocationAlt className={styles.icon} /><label>Населений пункт*</label></div>
                        <Controller
                            name="settlement"
                            control={control}
                            rules={{ required: "Населений пункт не може бути пустим" }}
                            render={({ field: { onChange, value } }) => (
                                <AutocompleteInput
                                    dataToSearch={settlements}
                                    value={value}
                                    onChange={onChange}
                                    defaultValue={watch().settlement ? watch().settlement : null}
                                />
                            )}
                        />
                        {errors.settlement && <span className={standartStyles.errorMessage}>{errors.settlement.message}</span>}
                    </fieldset>
                    <fieldset>
                        <div><MdOutlineAddLocationAlt className={styles.icon} /><label>Адреса*</label></div>
                        <input type='text' defaultValue={'вулиця Якась'} className={`${standartStyles.inputRegular}`} placeholder="вул. Вишнева, буд. 131а/б" {...register("address", { required: "Адреса обов'язкова"})} />
                        {errors.address && <span className={styles.errorMessage}>{errors.address.message}</span>}
                    </fieldset>
                    <fieldset>
                        <div><TbSchool className={styles.icon}/><label>Школа*</label></div>

                        <Controller
                            name="institution"
                            control={control}
                            rules={{ required: "Школа не може бути не обраною" }}
                            render={({ field: { onChange, value } }) => (
                                <Search value={value} onChange={(newValue) => {
                                    onChange(newValue); // This will update the value in the form state
                                    // Your additional logic here to set id into the form
                                    const selectedInstitution = institutions.find(inst => inst.fullname === newValue);
                                    if (selectedInstitution) {
                                        setValue("institutionUseedCode", selectedInstitution.useed_code); // Set the id into the form
                                    }
                                }} dataToSearch={institutions} defaultValue={watch().institution ? watch().institution.fullname : null} placeholder={'Шукати школу...'} searchFields={['fullame', 'shortname', 'settlement']}/>
                            )}
                        />
                        {errors.institution && <span className={standartStyles.errorMessage}>{errors.institution.message}</span>}

                    </fieldset>
                <button type="submit" onClick={handleSubmit(submitionHandler)}>Зареєструватись</button>
            </form> 
        </div>     
    );
}

export default sign_up;