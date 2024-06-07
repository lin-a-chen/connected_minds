import styles from "@/components/main pages/admin/AdminTable.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import { TbPencilMinus, TbCheck } from "react-icons/tb";
import { LuTrash2 } from "react-icons/lu";
import { useState } from "react";
import NothingToShow from "@/components/modals/NothingToShow";

export default function AdminTable({
  tableHeaders,
  items,
  crudLink,
  uniqueField,
  onUpdateItems,
  immutableFields,
  fieldsToHide,
}) {
  const [editableRow, setEditableRow] = useState(null);

  const handleEdit = (itemsUniqueField) => {
    setEditableRow(itemsUniqueField);
  };

  const handleSave = async (item) => {
    setEditableRow(null);

    const response = await fetch(crudLink, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    const result = await response.json();
    if (!result.success) {
      console.error(result.data);
    }
  };

  const handleDelete = async (itemsUniqueField) => {
    const response = await fetch(
      `${crudLink}?${uniqueField}=${itemsUniqueField}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.success) {
      const newItems = items.filter(
        (el) => el[uniqueField] !== itemsUniqueField
      );
      onUpdateItems(newItems);
    } else {
      console.error(result.data);
    }
  };

  const handleInputChange = (e, itemsUniqueField, field) => {
    if (immutableFields.includes(field)) return;

    const updatedItems = items.map((item) => {
      if (item[uniqueField] === itemsUniqueField) {
        return { ...item, [field]: e.target.value };
      }
      return item;
    });
    onUpdateItems(updatedItems);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            {tableHeaders.map((header, index) =>
              !fieldsToHide.includes(header) ? (
                <th key={index}>{header}</th>
              ) : null
            )}
          </tr>
        </thead>
        <tbody>
          {items.length > 0 &&
            items.map((item) => (
              <tr key={`tr${item[uniqueField]}`}>
                <td className={styles.buttons}>
                  {editableRow === item[uniqueField] ? (
                    <button
                      className={`${standartStyles.buttonSave} ${standartStyles.buttonIconNoText}`}
                      onClick={() => handleSave(item)}
                    >
                      <TbCheck />
                    </button>
                  ) : (
                    <button
                      className={`${standartStyles.buttonEdit} ${standartStyles.buttonIconNoText}`}
                      onClick={() => handleEdit(item[uniqueField])}
                    >
                      <TbPencilMinus />
                    </button>
                  )}
                  <button
                    className={`${standartStyles.buttonDelete} ${standartStyles.buttonIconNoText}`}
                    onClick={() => handleDelete(item[uniqueField])}
                  >
                    <LuTrash2 />
                  </button>
                </td>
                {Object.keys(item).map((field, index) =>
                  !fieldsToHide.includes(field) ? (
                    <td key={index}>
                      {editableRow === item[uniqueField] &&
                      !immutableFields.includes(field) ? (
                        <textarea
                          value={item[field]}
                          onChange={(e) =>
                            handleInputChange(e, item[uniqueField], field)
                          }
                        />
                      ) : (
                        <span>{item[field]}</span>
                      )}
                    </td>
                  ) : null
                )}
              </tr>
            ))}
        </tbody>
      </table>
      {items.length <= 0 && (
        <NothingToShow imageSource={"images/nothing.png"} />
      )}
    </div>
  );
}
