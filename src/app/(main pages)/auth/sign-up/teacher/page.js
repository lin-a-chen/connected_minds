'use client'
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import AutocompleteInput from "@/components/UI/AutocompleteInput/AutocompleteInput";
import { LuPhone, LuSchool, LuBaby, LuCross, LuTrash2, LuBookMarked   } from "react-icons/lu";
import { MdOutlinePassword, MdOutlineAddLocationAlt } from "react-icons/md";
import { TbMail, TbCalendar, TbSchool, TbBabyBottle, TbOld, TbPencilMinus } from "react-icons/tb";
import Search from "@/components/UI/AutocompleteInput/Search";
import standartStyles from "@/styles/Styles.module.scss";
import styles from "@/styles/main pages/auth/Auth.module.scss";
import { InfoPopup, ErrorPopup } from '@/components/modals/Popups';
import { toast } from "react-toastify";
import { FaChalkboardTeacher } from "react-icons/fa";
import Loading from "@/components/modals/Loading";

const SignUpTeacher = () => {
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [showPopup, setShowPopup] = useState(null);
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
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

    const submitionHandler = async (data) => {
      setShowPopup(false);
      const teacherData = {
        ...data,
        institution_useed_code: data.institution.useed_code,
      };
      try {
        // Validate the data
        const validationResponse = await fetch("/api/auth/sign-up/teacher/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teacherData),
        });
        const validationResult = await validationResponse.json();
    
        if (!validationResult.success) {
          setShowPopup(null);
          toast.error(validationResult.data);
          return;
        }
    
        // Add the teacher
        const addTeacherResponse = await fetch("/api/auth/sign-up/teacher", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teacherData),
        });
        const addTeacherResult = await addTeacherResponse.json();
    
        if (!addTeacherResult.success) {
          setShowPopup(null);
          toast.error(addTeacherResult.data);
          return;
        }
    
        // Add the request
        const addRequestResponse = await fetch(`/api/requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({email: teacherData.email, request_type: "ADD_TEACHER"}),
        });
        const addRequestResult = await addRequestResponse.json();
    
        if (!addRequestResult.success) {
          setShowPopup(null);
          toast.error(addRequestResult.data);
          return;
        }
    
        setShowPopup(true);
    
      } catch (error) {
        setShowPopup(null);
        toast.error("An unexpected error occurred.");
        console.error(error);
      }
    };
    

  const addSubject = () => {
    setSubjects([...subjects, { id: subjects.length, value: "" }]);
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  useEffect(() => {}, [showPopup]);

  return (
    <div className={styles.authPage}>
      {showPopup && <InfoPopup linkForButtonOkay={'/'} pictureSource={"\\images\\checklist.png"} text={'На вказану пошту має надійти лист з подальшими інструкціями. Дякуємо, що ви з нами!'} 
            heading={'Реєстрація успішна'}/>}
      {showPopup === false && <Loading/>}
      {showPopup === null && <>
      
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
          <div>
            <div className={styles.icon}><TbCalendar/></div>
            <label className={standartStyles.labelForFormElements}>Дата народження*</label>
          </div>
          <input
            type="date"
            placeholder="01/01/1970"
            {...register("birthDate", {
              required: "Дата народження не може бути пустою",
              validate: {
                validAgeRange: (value) => {
                  return (
                    (value <= minDate) ||
                    `Якщо ви вчителька чи вчитель, то ваш вік більше 18 років`
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
            <TbMail className={styles.icon} />
            <label className={standartStyles.labelForFormElements}>Email*</label>
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
          <div>
           <div className={standartStyles.icon}><LuBaby/></div>
            <label className={standartStyles.labelForFormElements}>Ви вчите*</label>
          </div>
          <div className={styles.radioButtonWithLabelAndIcon}>
            <div><input
              checked={true}
              type="radio"
              value="Молодшу школу"
              id={'primarySchoolRadioButton'}
              {...register("classesType", { required: "Це поле обов'язкове" })}
            /></div>
            <label htmlFor={'primarySchoolRadioButton'}>Молодшу школу</label>
          </div>
          <div className={styles.radioButtonWithLabelAndIcon}>
          <div><input
              type="radio"
              value="Старшу школу"
              id={'highSchoolRadioButton'}
              {...register("classesType", { required: "Це поле обов'язкове" })}
            /></div>
            <label htmlFor={'highSchoolRadioButton'}>Старшу школу</label>
          </div>
          {errors.classesType && (
            <span className={styles.errorMessage}>{errors.classesType.message}</span>
          )}
        </fieldset>
        <fieldset>
          <div>
            <div className={standartStyles.icon}><LuBookMarked/></div>
            <label className={standartStyles.labelForFormElements}>Предмет*</label>
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
                className={`${standartStyles.buttonIconNoText} ${standartStyles.buttonDelete}`}
              >
                <LuTrash2/>
              </button>
            </div>
          ))}
          <button className={`${standartStyles.buttonIconNoText} ${standartStyles.buttonAdd}`} type="button" onClick={addSubject}>
            <LuCross/>
          </button>
        </fieldset>
        <fieldset>
            <div>
                <div className={styles.icon}><FaChalkboardTeacher/></div>
                <label className={standartStyles.labelForFormElements}>Посада/кваліфікація*</label>
            </div>
            <input
                type="text"
                defaultValue={"Вчитель молодших класів вищої категорії"}
                className={`${standartStyles.inputRegular}`}
                placeholder="Вчитель молодших класів вищої категорії"
                {...register("position", { required: "Назва посади/кваліфікація обов'язкова" })}
            />
            {errors.position && (
                <span className={styles.errorMessage}>{errors.position.message}</span>
            )}
            </fieldset>
        <fieldset>
            <div>
                <MdOutlineAddLocationAlt className={styles.icon} />
                <label className={standartStyles.labelForFormElements}>Область*</label>
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
                <label className={standartStyles.labelForFormElements}>Населений пункт*</label>
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
                <label className={standartStyles.labelForFormElements}>Адреса*</label>
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
                <label className={standartStyles.labelForFormElements}>Школа*</label>
            </div>

            <Controller
            name="institution"
            control={control}
            rules={{ required: "Школа не може бути не обраною" }}
            render={({ field: { onChange, value } }) => (
              <Search
                value={value}
                onChange={(newValue) => {
                  const selectedInstitution = institutions.find(inst => inst.fullname === newValue);
                  if (selectedInstitution) {
                    setValue("institution", selectedInstitution); 
                    onChange(selectedInstitution.fullname); // Set only the fullname to the form
                  } else {
                    onChange(newValue);
                  }
                }}
                dataToSearch={institutions}
                defaultValue={watch().institution ? watch().institution.fullname : null}
                placeholder={"Шукати школу..."}
                searchFields={["fullname", "shortname", "settlement"]}
              />
            )}
          />

            {errors.institution && (
                <span className={standartStyles.errorMessage}>{errors.institution.message}</span>
            )}
            </fieldset>

        <button className={`${standartStyles.buttonSubmit}`} type="submit">
          Зареєструватись
        </button>
      </form>
      </>}
    </div>
  );
};

export default SignUpTeacher;
