'use client';

import React, { useEffect, useState } from "react";
import Loading from "@/components/modals/Loading";
import styles from "@/components/main pages/admin/AdminTablePage.module.scss";
import Pagination from "@/components/modals/Pagination";
import AdminTable from "@/components/main pages/admin/AdminTable";
import Search from "@/components/UI/AutocompleteInput/Search";

export default function Institutions() {
  const [institutions, setInstitutions] = useState([]);
  const [currentInstitutions, setCurrentInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchInstitutions = async () => {
      try {
        const response = await fetch(`/api/institutions`, { method: "GET" });
        const result = await response.json();

        if (result.success) {
          setInstitutions(result.data);
          handleCurrentItemsChange(result.data.slice(0, 10)); // Initial pagination setup
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
    setCurrentInstitutions(currentItems);
  };

  const handleSearchChange = (result) => {
    if (result) {
      setCurrentInstitutions([result]);
    } else {
      handleCurrentItemsChange(institutions.slice(0, 10)); // Reset to initial state or handle as needed
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <Search
        className={styles.autocompleteInput}
        dataToSearch={institutions}
        searchFields={['shortname', 'fullname', 'useed_code', 'principal_fullname']}
        onChange={handleSearchChange}
        placeholder="Шукати заклад..."
      />
      <AdminTable
        tableHeaders={['ID в базі даних', 'Повна назва', 'Код ЄДЕБО', 'Коротка назва', 'Стан', 'Тип закладу', 
        'Форма власності', 'Код КОАТУУ', 'Область', 'Населений пункт', 'Адреса', 'Орган, до сфери управління його належить заклад освіти', 'Телефон', 
        'Email', 'Веб-сайт', 'ПІБ директорки/директора', 'Акаунт адміністратора']}
        institutions={currentInstitutions}
        crudLink={'/api/institutions'}
        items={currentInstitutions}
        onUpdateItems={handleCurrentItemsChange}
        uniqueField={'useed_code'}
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
