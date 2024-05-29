import styles from "../../../app/(main pages)/admin/institutions/Institutions.module.scss"
import standartStyles from "@/styles/Styles.module.scss";
import { TbPencilMinus, TbCheck } from "react-icons/tb";
import { LuTrash2 } from "react-icons/lu";
import { useState } from "react";

export default function InstitutionsTable({ institutions, onUpdateInstitutions }) {
  const [editableRow, setEditableRow] = useState(null);

  const handleEdit = (useedCode) => {
    setEditableRow(useedCode);
  };

  const handleSave = async (institution) => {
    setEditableRow(null);
    const response = await fetch(`/api/institutions`, {
      method: "PUT",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(institution)
    });
    const result = await response.json();
    if (result.success) {
      console.log('success');
    } else {
      console.error(result.data);
    }
  };

  const handleDelete = async (useedCode) => {
    const response = await fetch(`/api/institutions?useed=${useedCode}`, {
      method: "DELETE",
      headers: {
        "Content-Type":"application/json"
      }
    });
    const result = await response.json();
    if (result.success) {
      const newInstitutions = institutions.filter(el => el.useed_code !== useedCode);
      onUpdateInstitutions(newInstitutions);
    } else {
      console.error(result.data);
    }
  };
  

  const handleInputChange = (e, useedCode, field) => {
    const updatedInstitutions = institutions.map((institution) => {
      if (institution.useed_code === useedCode) {
        return { ...institution, [field]: e.target.value };
      }
      return institution;
    });
    onUpdateInstitutions(updatedInstitutions);
  };

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Повна назва</th>
          <th>Коротка назва</th>
          <th>Код ЄДЕБО</th>
          <th>Область</th>
          <th>Населений пункт</th>
          <th>Адреса</th>
          <th>Код КОАТУУ</th>
          <th>Тип закладу</th>
          <th>Форма власності</th>
          <th>Орган, до сфери управління його належить заклад освіти</th>
          <th>Телефон</th>
          <th>Email</th>
          <th>Веб-сайт</th>
          <th>ПІБ директорки/директора</th>
          <th>Акаунт адміністратора</th>
        </tr>
      </thead>
      <tbody>
        {institutions.map((institution) => (
          <tr key={institution.useed_code}>
            <td className={styles.buttons}>
              {editableRow === institution.useed_code ? (
                <button
                  className={`${standartStyles.buttonSave} ${standartStyles.buttonIconNoText}`}
                  onClick={() => handleSave(institution)}
                >
                <TbCheck />
                </button>
              ) : (
                <button
                  className={`${standartStyles.buttonEdit} ${standartStyles.buttonIconNoText}`}
                  onClick={() => handleEdit(institution.useed_code)}
                >
                  <TbPencilMinus />
                </button>
              )}
              <button
                className={`${standartStyles.buttonDelete} ${standartStyles.buttonIconNoText}`}
                onClick={() => handleDelete(institution.useed_code)}
              >
                <LuTrash2 />
              </button>
            </td>
            {Object.keys(institution).map((field, index) => (
              <td key={index}>
                {editableRow === institution.useed_code ? (
                  <textarea
                    value={institution[field]}
                    onChange={(e) => handleInputChange(e, institution.useed_code, field)}
                  />
                ) : (
                  institution[field]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
