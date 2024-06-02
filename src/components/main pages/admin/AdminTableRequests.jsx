import styles from "@/components/main pages/admin/AdminTable.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import { TbPencilMinus, TbCheck } from "react-icons/tb";
import { LuBadgeCheck, LuBadgeMinus, LuTrash2 } from "react-icons/lu";
import { useState } from "react";
import Loading from "@/components/modals/Loading";
import NothingToShow from "@/components/modals/NothingToShow";

export default function AdminTableRequests({tableHeaders, items, crudLink, uniqueField, onUpdateItems, immutableFields, onApprove, onDeny }) {
  const [editableRow, setEditableRow] = useState(null);
  const [actionChangeStatusPressed, setActionChangeStatusPressed] = useState(null);

  const handleEdit = (itemsUniqueField) => {
    setEditableRow(itemsUniqueField);
  };

  const handleSave = async (item) => {
    setEditableRow(null);

    const response = await fetch(crudLink, {
      method: "PUT",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(item)
    });
    const result = await response.json();
    if (result.success) {
      console.log('success');
    } else {
      console.error(result.data);
    }
  };

  const handleDelete = async (itemsUniqueField) => {
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

  const handleApprove = async (item) => {
    setEditableRow(null);
    setActionChangeStatusPressed(true);

    const response = await fetch(crudLink, {
      method: "PATCH",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({id: item.id, status: 'approved', user_id: item.user_id, request_type: item.request_type})
    });
    const result = await response.json();

    if (result.success) {

      const userResponse = await fetch(`/api/users?id=${item.user_id}`);
      const userResult = await userResponse.json();

      if (userResult.success){
        const letter = {heading: '', text: '', ifWrongUserMessage: ''};

        if (item.request_type === 'ADD_INSTITUTION'){
          letter.heading = 'Вашу заявку було погоджено!';
          letter.text = 'Дякуємо, що зареєстрували навчальний заклад на ConnectedMinds! Тепер ви можете керувати закладом з власного акаунту. Натисніть на кнопку нижче, щоб перейти на сайт';
          letter.ifWrongUserMessage = 'Якщо ви не реєстрували навчальний заклад, проігноруйте це повідомлення';
        }

        const sendEmailResponse = await fetch(`/api/mail`, {method: 'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({email: userResult.data.email, heading: letter.heading, ifWrongUserMessage: letter.ifWrongUserMessage, text: letter.text})
        });
        const sendEmailResult = await sendEmailResponse.json();
        
        if (sendEmailResult.success){
          setActionChangeStatusPressed(false);
          onApprove(true);
        }
        else{
          console.error('Couldn\'t send an email');
        }
        setActionChangeStatusPressed(false);
        onApprove(true);
      }
      else{
        console.error('Couldn\'t send an email');
      }

      
    }
    else{
      console.error(result.data);
      setActionChangeStatusPressed(false);
      onApprove(false);
    }

  };

  const handleDeny = async (item) => {
    setEditableRow(null);
    setActionChangeStatusPressed(true);

    const response = await fetch(crudLink, {
      method: "PATCH",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({id: item.id, status: 'denied', user_id: item.user_id, request_type: item.request_type})
    });
    const result = await response.json();
    if (result.success) {

      const userResponse = await fetch(`/api/users?id=${item.user_id}`);
      const userResult = await userResponse.json();

      if (userResult.success){
        const letter = {heading: '', text: '', ifWrongUserMessage: ''};

        if (item.request_type === 'ADD_INSTITUTION'){
          letter.heading = 'Вашу заявку було відхилено :(';
          letter.text = 'Щоб дізнатись причину, ви можете зв\'язатись з адміністратором. Натисніть на кнопку нижче, щоб перейти на сайт';
          letter.ifWrongUserMessage = 'Якщо ви не реєстрували навчальний заклад, проігноруйте це повідомлення';
        }

        const sendEmailResponse = await fetch(`/api/mail`, {method: 'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({email: userResult.data.email, heading: letter.heading, ifWrongUserMessage: letter.ifWrongUserMessage, text: letter.text})
        });
        const sendEmailResult = await sendEmailResponse.json();
        
        if (sendEmailResult.success){
          setActionChangeStatusPressed(false);
          onDeny(true);
        }
        else{
          console.error('Couldn\'t send an email');
        }
      }
      else{
        console.error('Couldn\'t send an email');
      }
      
    } else {
      console.error(result.data);
      setActionChangeStatusPressed(false);
      onDeny(false);
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
        {!actionChangeStatusPressed && items.length > 0 && <tbody>
          {items.map((item) => (
            <tr key={item[uniqueField]} className={`${item.status === 'approved' ? styles.rowApproved : item.status === 'denied' ? styles.rowDenied : ''}`}>
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
                {item.status === 'pending' && 
                <>
                <button
                  className={`${standartStyles.buttonSave} ${standartStyles.buttonIconNoText}`}
                  onClick={() => handleApprove(item)}
                >
                  <LuBadgeCheck />
                </button>
                <button
                  className={`${standartStyles.buttonDelete} ${standartStyles.buttonIconNoText}`}
                  onClick={() => handleDeny(item)}
                >
                  <LuBadgeMinus />
                </button>
                </>
                }
              </td>
              {Object.keys(item).map((field, index) => (
                <td key={index}>
                  {editableRow === item[uniqueField] && !immutableFields.includes(field) ? (
                    <textarea
                      value={item[field]}
                      onChange={(e) => handleInputChange(e, item[uniqueField], field)}
                    />
                  ) : (
                    <span>{item[field]}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>}
      </table>
      {items.length <= 0 && <NothingToShow imageSource={'images/nothing.png'}/>}
      {actionChangeStatusPressed && <Loading/>}

    </div>
    
  );
}
