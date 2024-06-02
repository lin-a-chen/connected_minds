import styles from "@/components/main pages/admin/AdminTable.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import NothingToShow from "@/components/modals/NothingToShow";
import { LuTrash2 } from "react-icons/lu";

export default function AdminTableUserRoles({tableHeaders, items, crudLink, uniqueField, onUpdateItems }) {


  const handleDelete = async (itemsUniqueField) => {
    console.log('url', `${crudLink}?${uniqueField}=${itemsUniqueField}`)
    const response = await fetch(`${crudLink}?${uniqueField}=${itemsUniqueField}`, {
      method: "DELETE",
      headers: {
        "Content-Type":"application/json"
      }
    });
    const result = await response.json();
    if (result.success) {
      const newItems = items.filter(el => el[uniqueField] !== itemsUniqueField);
      onUpdateItems(newItems);
    } else {
      console.error(result.data);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            {tableHeaders.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        {items.length > 0 && <tbody>
          {items.map((item) => (
            <tr key={item[uniqueField]}>
              <td className={styles.buttons}>
                <button
                  className={`${standartStyles.buttonDelete} ${standartStyles.buttonIconNoText}`}
                  onClick={() => handleDelete(item[uniqueField])}
                >
                  <LuTrash2 />
                </button>
              </td>
              {Object.keys(item).map((field, index) => (
                <td key={index}>
                  {item[field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>}
      </table>
      {items.length <= 0 && <NothingToShow imageSource={'images/nothing.png'}/>}
    </div>
    
  );
}
