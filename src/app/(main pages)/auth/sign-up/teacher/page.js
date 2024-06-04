// 'use client'
// import Link from "next/link";
// import { useForm, Controller } from "react-hook-form";
// import { useState, useEffect} from "react";
// import AutocompleteInput from "@/components/UI/AutocompleteInput/AutocompleteInput";

// import standartStyles from "@/styles/Styles.module.scss";
// import styles from "@/styles/main pages/auth/Auth.module.scss";

// import { LuMail, LuPhone, LuSchool } from "react-icons/lu";
// import { MdOutlinePassword, MdOutlineAddLocationAlt } from "react-icons/md";
// import { TbMail, TbPhone, TbUserHexagon, TbCalendar, TbPasswordUser, TbCodeAsterisk, TbLink, TbUserDollar, TbSchool, TbPencilMinus } from "react-icons/tb";
// import Search from "@/components/UI/AutocompleteInput/Search";

// const SignUpTeacher = () => {
//     const [regions, setRegions] = useState([]);
//     const [region, setRegion] = useState(null);
//     const [settlements, setSettlements] = useState([]);
//     const [showPopup, setShowPopup] = useState(false);
//     const [institutions, setInstitutions] = useState([]);
//     const [subjectsCount, setSubjectCount] = useState(1);
//     const [subjectsSelects, setSubjectsSelects] = useState([]);
//     const [subjects, setSubjects] = useState([]);

//     const {
//         register,
//         handleSubmit,
//         watch,
//         formState: { errors },
//         control,
//         setValue
//     } = useForm();

//     const fetchRegions = async () => {
//         const response = await fetch(`/api/settlements`, { method: "GET" });
//         const result = await response.json();
//         if (result.success) {
//             setRegions(result.data);
//         } else {
//             console.error(result.data);
//         }
//     };

//     const handleRegionSelection = (e) => {
//         setRegion(e.target.value);
//     }

//     useEffect(() => {
//         fetchRegions();
//     }, []);

//     useEffect(() => {
//         if (region){
//             const fetchSettlements = async () => {
//                 const response = await fetch(`/api/settlements?region=${region}`);
//                 const result = await response.json();
//                 if (result.success) {
//                     const settlements = result.data.map(el => `${el.category} ${el.name} (${el.district})`);
//                     setSettlements(settlements);
//                 } else {
//                     console.error(result.data);
//                 }
//             };
//             fetchSettlements();
//         }
        
//     }, [region]);

//     useEffect(() => {
//         const fetchInstitutions = async () => {
//             const response = await fetch(`/api/institutions`);
//             const result = await response.json();
//             if (result.success) {
//                 setInstitutions(result.data);
//             } else {
//                 console.error(result.data);
//             }
//         };
//         fetchInstitutions();
        
//     }, []);

//     const today = new Date();
//     const minDate = new Date(today.getFullYear() - 19, today.getMonth(), today.getDate()).toISOString().split('T')[0];
//     const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate()).toISOString().split('T')[0];


//     const submitionHandler = async(data) => {
//         const response = await fetch('/api/auth/sign-up/school-child', {method: "POST", 
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify(data)
//         });
//         const result = await response.json();
//         if (result.success) {
//             window.location.href = '/';
//         } else {
//             console.error(result.data);
//         }
//     }

//     useEffect(() => {
//         const selects = [];
//         for (let i = 0; i < subjectsCount; i++){
//             selects.push(
//                     <>
//                         <select key={i} defaultValue={''} {...register(`subjectName${i}`, { required: 'Потрібно обрати предмет' })}>
//                             <option value={''}>Оберіть предмет</option>
//                             {subjects && subjects.map((el, index) => (
//                                 <option key={index} value={el}>{el}</option>
//                             ))}
//                         </select>
//                         {errors[`subjectName${i}`] && <span className={styles.errorMessage}>{errors[`subjectName${i}`].message}</span>}            
//                     </>
//                 );
//         }
//     }, [subjectsCount, subjects]);

//     return(
//         <div className={styles.authPage}>
//             <div>
//                 <div className={styles.logo}>
//                     <img src="\images\Logo.svg"></img><h1>ConnectedMinds</h1>
//                 </div>
//                 <h3>Маєш акаунт?</h3>
//                 <Link className={styles.link} href="/auth/sign-in">Увійти</Link>
//             </div>
//             <form onSubmit={handleSubmit(submitionHandler)} encType="application/json" className={standartStyles.form} method="POST">
//                 <fieldset>
//                     <label>Ім'я*</label>
//                     <input defaultValue="Тетяна" placeholder="Тетяна" {...register("firstname", { required: 'Ім\'я не може бути пустим' })}/>
//                     {errors.firstname && <span className={styles.errorMessage}>{errors.firstname.message}</span>}
//                 </fieldset>
//                 <fieldset>
//                     <label>Прізвище*</label>
//                     <input defaultValue="Тетяненко" placeholder="Тетяненко" {...register("lastname", { required: 'Прізвище не може бути пустим' })}/>
//                     {errors.lastname && <span className={styles.errorMessage}>{errors.lastname.message}</span>}
//                 </fieldset>
//                 <fieldset>
//                     <label>По-батькові*</label>
//                     <input defaultValue="Тетянівна" placeholder="Тетянівна" {...register("antroponym", { required: 'По матері чи по батькові не може бути пустим' })}/>
//                     {errors.antroponym && <span className={styles.errorMessage}>{antroponym.lastname.message}</span>}
//                 </fieldset>
//                 <fieldset>
//                     <div><TbCalendar className={styles.icon}/><label>Дата народження*</label></div>
//                     <input type="date" placeholder="01/01/1970" {...register("birthDate", { required: 'Дата народження не може бути пустою',
//                     validate: {
//                         validAgeRange: (value) => {
//                             return (value >= minDate && value <= maxDate) || `Якщо ви учениця чи учень, то ваш вік від 5 до 19 років`;
//                           }
//                     }})}/>
//                     {errors.birthdayDate && <span className={styles.errorMessage}>{errors.birthdayDate.message}</span>}
//                 </fieldset>
//                 <fieldset>
//                     <div><LuPhone className={styles.icon} /><label>Телефон*</label></div>
//                         <input defaultValue={'+38(073)333-45-21'} type="tel" className={`${standartStyles.inputRegular}`} placeholder="+38(067)9998877" {...register("phoneNumber", { required: "Ви пропустили номер телефону",
//                             pattern: {
//                                 value: /^\+38\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
//                                 message: "Формат номеру невірний"
//                             }
//                         })} />
//                     {errors.phoneNumber && <span className={styles.errorMessage}>{errors.phoneNumber.message}</span>}
//                 </fieldset>
//                 <fieldset>
//                     <div><TbMail className={styles.icon}/><label>Email*</label></div>
//                     <input defaultValue="ipz202_bro@student.ztu.edu.ua" type="email" placeholder="maria.marienko@mail.com" {...register("email", { required: 'Ви пропустили email', 
//                     pattern: {
//                         value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                         message: "Формат email невірний"
//                     }  })}/>
//                     {errors.email && <span className={styles.errorMessage}>Email is invalid</span>}
//                 </fieldset>
//                 <fieldset>
//                     <div><MdOutlinePassword className={styles.icon} /><label>Пароль*</label></div>
//                     <input className={`${standartStyles.inputRegular}`} type="password" {...register("password", { required: "Ви пропустили пароль",
//                         minLength: {
//                             value: 8,
//                             message: "Пароль не може бути коротшим за 8 символів"
//                         },
//                         validate: {
//                             hasUpperCase: value => /[A-Z]/.test(value) || "Пароль повинен містити хоч одну велику літеру",
//                             hasLowerCase: value => /[a-z]/.test(value) || "Пароль повинен містити хоч одну маленьку літеру",
//                             hasNumber: value => /\d/.test(value) || "Пароль повинен містити хоч одну цифру",
//                             hasSpecialChar: value => /[!@#$%^&*]/.test(value) || "Пароль повинен містити хоч один спеціальний символ"
//                         }
//                     })} />
//                     {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
//                 </fieldset>
//                 <fieldset>
//                     <div><MdOutlinePassword className={styles.icon} /><label>Повторіть пароль*</label></div>
//                     <input className={`${standartStyles.inputRegular}`} type="password" {...register("repeatPassword", {
//                         required: "Повторіть пароль",
//                         validate: (value) => value === watch("password") || "Паролі не сходяться",
//                     })} />
//                     {errors.repeatPassword && <span className={styles.errorMessage}>{errors.repeatPassword.message}</span>}
//                 </fieldset>
//                 <fieldset>
//                     <div>
//                     <MdOutlinePassword className={styles.icon} />
//                     <label>Ви вчите*</label>
//                     </div>
//                     <label>
//                     Молодшу школу
//                     <input
//                         type="radio"
//                         value="Молодшу школу"
//                         {...register("classesType", { required: "This field is required" })}
//                     />
//                     </label>
//                     <label>
//                     Старшу школу
//                     <input
//                         type="radio"
//                         value="Старшу школу"
//                         {...register("classesType", { required: "This field is required" })}
//                     />
//                     </label>
//                     {errors.classesType && (
//                     <span className={styles.errorMessage}>{errors.classesType.message}</span>
//                     )}
//                 </fieldset>
//                 <fieldset>
//                     <div><MdOutlinePassword className={styles.icon} /><label>Предмет*</label></div>
//                     {subjectsSelects.map((el) => (
//                         {el}
//                     ))}
//                 </fieldset>
//                 <fieldset>
//                         <div><MdOutlineAddLocationAlt className={styles.icon} /><label>Область*</label></div>
//                         <select className={`${standartStyles.selectRegular}`} {...register("region", { required: "Область обов'язкова" })} onChange={handleRegionSelection}>
//                             <option value="">Оберіть область</option>
//                             {regions && regions.map((el, index) => (
//                                 <option key={index} value={el}>{el}</option>
//                             ))}
//                         </select>
//                         {errors.region && <span className={standartStyles.errorMessage}>{errors.region.message}</span>}
//                     </fieldset>
//                     <fieldset>
//                         <div><MdOutlineAddLocationAlt className={styles.icon} /><label>Населений пункт*</label></div>
//                         <Controller
//                             name="settlement"
//                             control={control}
//                             rules={{ required: "Населений пункт не може бути пустим" }}
//                             render={({ field: { onChange, value } }) => (
//                                 <AutocompleteInput
//                                     dataToSearch={settlements}
//                                     value={value}
//                                     onChange={onChange}
//                                     defaultValue={watch().settlement ? watch().settlement : null}
//                                 />
//                             )}
//                         />
//                         {errors.settlement && <span className={standartStyles.errorMessage}>{errors.settlement.message}</span>}
//                     </fieldset>
//                     <fieldset>
//                         <div><MdOutlineAddLocationAlt className={styles.icon} /><label>Адреса*</label></div>
//                         <input type='text' defaultValue={'вулиця Якась'} className={`${standartStyles.inputRegular}`} placeholder="вул. Вишнева, буд. 131а/б" {...register("address", { required: "Адреса обов'язкова"})} />
//                         {errors.address && <span className={styles.errorMessage}>{errors.address.message}</span>}
//                     </fieldset>
//                     <fieldset>
//                         <div><TbSchool className={styles.icon}/><label>Школа*</label></div>

//                         <Controller
//                             name="institution"
//                             control={control}
//                             rules={{ required: "Школа не може бути не обраною" }}
//                             render={({ field: { onChange, value } }) => (
//                                 <Search value={value} onChange={(newValue) => {
//                                     onChange(newValue); // This will update the value in the form state
//                                     // Your additional logic here to set id into the form
//                                     const selectedInstitution = institutions.find(inst => inst.fullname === newValue);
//                                     if (selectedInstitution) {
//                                         setValue("institutionUseedCode", selectedInstitution.useed_code); // Set the id into the form
//                                     }
//                                 }} dataToSearch={institutions} defaultValue={watch().institution ? watch().institution.fullname : null} placeholder={'Шукати школу...'} searchFields={['fullame', 'shortname', 'settlement']}/>
//                             )}
//                         />
//                         {errors.institution && <span className={standartStyles.errorMessage}>{errors.institution.message}</span>}

//                     </fieldset>
//                 <button className={standartStyles.buttonSubmit} type="submit" onClick={handleSubmit(submitionHandler)}>Зареєструватись</button>
//             </form> 
//         </div>     
//     );
// }

// export default SignUpTeacher;

'use client'
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import AutocompleteInput from "@/components/UI/AutocompleteInput/AutocompleteInput";
import { LuPhone, LuSchool } from "react-icons/lu";
import { MdOutlinePassword, MdOutlineAddLocationAlt } from "react-icons/md";
import { TbMail, TbCalendar, TbSchool } from "react-icons/tb";
import Search from "@/components/UI/AutocompleteInput/Search";
import standartStyles from "@/styles/Styles.module.scss";
import styles from "@/styles/main pages/auth/Auth.module.scss";

const SignUpTeacher = () => {
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [subjects, setSubjects] = useState([{ id: 0, value: "" }]);
  const [availableSubjects, setAvailableSubjects] = useState([
    "Math",
    "Science",
    "History",
    "English",
  ]); // Add more subjects as needed

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
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
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (region) {
      const fetchSettlements = async () => {
        const response = await fetch(`/api/settlements?region=${region}`);
        const result = await response.json();
        if (result.success) {
          const settlements = result.data.map(
            (el) => `${el.category} ${el.name} (${el.district})`
          );
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
  const minDate = new Date(
    today.getFullYear() - 19,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  const maxDate = new Date(
    today.getFullYear() - 5,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const submitionHandler = async (data) => {
    const response = await fetch("/api/auth/sign-up/school-child", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
      window.location.href = "/";
    } else {
      console.error(result.data);
    }
  };

  const addSubject = () => {
    setSubjects([...subjects, { id: subjects.length, value: "" }]);
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  return (
    <div className={styles.authPage}>
      <div>
        <div className={styles.logo}>
          <img src="\images\Logo.svg" alt="Logo" />
          <h1>ConnectedMinds</h1>
        </div>
        <h3>Маєш акаунт?</h3>
        <Link className={styles.link} href="/auth/sign-in">
          Увійти
        </Link>
      </div>
      <form
        onSubmit={handleSubmit(submitionHandler)}
        encType="application/json"
        className={standartStyles.form}
        method="POST"
      >
        <fieldset>
          <label>Ім'я*</label>
          <input
            defaultValue="Тетяна"
            placeholder="Тетяна"
            {...register("firstname", { required: "Ім'я не може бути пустим" })}
          />
          {errors.firstname && (
            <span className={styles.errorMessage}>
              {errors.firstname.message}
            </span>
          )}
        </fieldset>
        <fieldset>
          <label>Прізвище*</label>
          <input
            defaultValue="Тетяненко"
            placeholder="Тетяненко"
            {...register("lastname", { required: "Прізвище не може бути пустим" })}
          />
          {errors.lastname && (
            <span className={styles.errorMessage}>{errors.lastname.message}</span>
          )}
        </fieldset>
        <fieldset>
          <label>По-батькові*</label>
          <input
            defaultValue="Тетянівна"
            placeholder="Тетянівна"
            {...register("antroponym", {
              required: "По матері чи по батькові не може бути пустим",
            })}
          />
          {errors.antroponym && (
            <span className={styles.errorMessage}>{errors.antroponym.message}</span>
          )}
        </fieldset>
        <fieldset>
          <div>
            <TbCalendar className={styles.icon} />
            <label>Дата народження*</label>
          </div>
          <input
            type="date"
            placeholder="01/01/1970"
            {...register("birthDate", {
              required: "Дата народження не може бути пустою",
              validate: {
                validAgeRange: (value) => {
                  return (
                    (value >= minDate && value <= maxDate) ||
                    `Якщо ви учениця чи учень, то ваш вік від 5 до 19 років`
                  );
                },
              },
            })}
          />
          {errors.birthDate && (
            <span className={styles.errorMessage}>{errors.birthDate.message}</span>
          )}
        </fieldset>
        <fieldset>
          <div>
            <LuPhone className={styles.icon} />
            <label>Телефон*</label>
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
            <TbMail className={styles.icon} />
            <label>Email*</label>
          </div>
          <input
            defaultValue="ipz202_bro@student.ztu.edu.ua"
            type="email"
            placeholder="maria.marienko@mail.com"
            {...register("email", {
              required: "Ви пропустили email",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Формат email невірний",
              },
            })}
          />
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email.message}</span>
          )}
        </fieldset>
        <fieldset>
          <div>
            <MdOutlinePassword className={styles.icon} />
            <label>Пароль*</label>
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
            <label>Повторіть пароль*</label>
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
          <div>
            <MdOutlinePassword className={styles.icon} />
            <label>Ви вчите*</label>
          </div>
          <label>
            Молодшу школу
            <input
              type="radio"
              value="Молодшу школу"
              {...register("classesType", { required: "Це поле обов'язкове" })}
            />
          </label>
          <label>
            Старшу школу
            <input
              type="radio"
              value="Старшу школу"
              {...register("classesType", { required: "Це поле обов'язкове" })}
            />
          </label>
          {errors.classesType && (
            <span className={styles.errorMessage}>{errors.classesType.message}</span>
          )}
        </fieldset>
        <fieldset>
          <div>
            <MdOutlinePassword className={styles.icon} />
            <label>Предмет*</label>
          </div>
          {subjects.map((subject) => (
            <div key={subject.id}>
              <select
                defaultValue={subject.value}
                onChange={(e) => {
                  const updatedSubjects = [...subjects];
                  updatedSubjects.find((s) => s.id === subject.id).value =
                    e.target.value;
                  setSubjects(updatedSubjects);
                }}
              >
                <option value="">Оберіть предмет</option>
                {availableSubjects.map((subjectOption, index) => (
                  <option key={index} value={subjectOption}>
                    {subjectOption}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeSubject(subject.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          ))}
          <button type="button" onClick={addSubject}>
            Add Subject
          </button>
        </fieldset>
        <fieldset>
            <div>
                <MdOutlineAddLocationAlt className={styles.icon} />
                <label>Область*</label>
            </div>
            <select
                className={`${standartStyles.selectRegular}`}
                {...register("region", { required: "Область обов'язкова" })}
                onChange={handleRegionSelection}
            >
                <option value="">Оберіть область</option>
                {regions &&
                regions.map((el, index) => (
                    <option key={index} value={el}>
                    {el}
                    </option>
                ))}
            </select>
            {errors.region && (
                <span className={standartStyles.errorMessage}>{errors.region.message}</span>
            )}
            </fieldset>
            <fieldset>
            <div>
                <MdOutlineAddLocationAlt className={styles.icon} />
                <label>Населений пункт*</label>
            </div>
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
            {errors.settlement && (
                <span className={standartStyles.errorMessage}>{errors.settlement.message}</span>
            )}
            </fieldset>
            <fieldset>
            <div>
                <MdOutlineAddLocationAlt className={styles.icon} />
                <label>Адреса*</label>
            </div>
            <input
                type="text"
                defaultValue={"вулиця Якась"}
                className={`${standartStyles.inputRegular}`}
                placeholder="вул. Вишнева, буд. 131а/б"
                {...register("address", { required: "Адреса обов'язкова" })}
            />
            {errors.address && (
                <span className={styles.errorMessage}>{errors.address.message}</span>
            )}
            </fieldset>
            <fieldset>
            <div>
                <TbSchool className={styles.icon} />
                <label>Школа*</label>
            </div>

            <Controller
                name="institution"
                control={control}
                rules={{ required: "Школа не може бути не обраною" }}
                render={({ field: { onChange, value } }) => (
                <Search
                    value={value}
                    onChange={(newValue) => {
                    onChange(newValue); 
                    const selectedInstitution = institutions.find(inst => inst.fullname === newValue);
                    if (selectedInstitution) {
                        setValue("institutionUsedCode", selectedInstitution.useed_code); 
                    }
                    }}
                    dataToSearch={institutions}
                    defaultValue={watch().institution ? watch().institution.fullname : null}
                    placeholder={"Шукати школу..."}
                    searchFields={["fullame", "shortname", "settlement"]}
                />
                )}
            />
            {errors.institution && (
                <span className={standartStyles.errorMessage}>{errors.institution.message}</span>
            )}
            </fieldset>

        <button className={standartStyles.buttonSubmit} type="submit">
          Зареєструватись
        </button>
      </form>
    </div>
  );
};

export default SignUpTeacher;
