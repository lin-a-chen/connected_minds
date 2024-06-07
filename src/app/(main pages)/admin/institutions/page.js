'use client';

import React, { useEffect, useState } from "react";
import Loading from "@/components/modals/Loading";
import styles from "@/styles/main pages/AdminTablePage.module.scss";
import Pagination from "@/components/modals/Pagination";
import AdminTable from "@/components/main pages/admin/AdminTable";
import Search from "@/components/UI/Search";
import { LuCross } from "react-icons/lu";
import AddAdmin from "@/components/modals/AddAdmin";
export default function Institutions() {
  const [institutions, setInstitutions] = useState([]);
  const [currentInstitutions, setCurrenInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addAdminOpened, setAddAdminOpened] = useState(false);

  useEffect(() => {

    const fetchInstitutions = async () => {
      try {
        const response = await fetch(`/api/institutions`, { method: "GET" });
        const result = await response.json();

        if (result.success) {
          setInstitutions(result.data);
          handleCurrentItemsChange(result.data.slice(0, 10));
        } else {
          console.error("Error fetching institutions:", result.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  const handleCurrentItemsChange = (currentItems) => {
    setCurrenInstitutions(currentItems);
  };

  const handleSearchChange = (result) => {
    if (result) {
      setCurrenInstitutions([result]);
    } else {
      handleCurrentItemsChange(institutions.slice(0, 10));
    }
  };

  if (loading) {
    return <Loading />;
  }

  const handleOpenAddAdmin = () => {
    setAddAdminOpened(true);
  }

  const handleCloseAddAdmin = () => {
    setAddAdminOpened(false);
  }

  return (
    <div className={styles.container}>
        <div className={styles.topPanel}>
            <button onClick={handleOpenAddAdmin} className={styles.addAdminButton}><LuCross/>Призначити адміністратора</button>
            <Search
                className={styles.autocompleteInput}
                dataToSearch={institutions}
                searchFields={['user_id', 'shortname', 'fullname', 'useed_code', 'admin_user_fullname']}
                onChange={handleSearchChange}
                placeholder="Шукати заклад..."
            />
        </div>

        {<AddAdmin isVisible={addAdminOpened} onClose={handleCloseAddAdmin}/>}
      
      <AdminTable
        tableHeaders={['ID в базі даних', 'Повна назва', 'Код ЄДЕБО', 'Коротка назва', 'Стан', 'Тип закладу', 
        'Форма власності', 'Код КОАТУУ', 'Область', 'Населений пункт', 'Адреса', 'Орган, до сфери управління його належить заклад освіти', 'Телефон', 
        'Email', 'Веб-сайт', 'ПІБ директорки/директора', 'Акаунт адміністратора НЗ']}
        institutions={currentInstitutions}
        crudLink={'/api/institutions'}
        items={currentInstitutions}
        onUpdateItems={handleCurrentItemsChange}
        uniqueField={'useed_code'}
        immutableFields={['id']}
        fieldsToHide={[]}
      />
      <Pagination
        onCurrentItemsChange={handleCurrentItemsChange}
        items={institutions}
        itemsPerPage={10}
        maxVisiblePages={7}
      />
    </div>
  );
}
