'use client';

import React, { useEffect, useState } from "react";
import Loading from "@/components/modals/Loading";
import styles from "@/components/main pages/admin/AdminTablePage.module.scss";
import Pagination from "@/components/modals/Pagination";
import AdminTable from "@/components/main pages/admin/AdminTable";
import Search from "@/components/UI/AutocompleteInput/Search";

export default function PendingInstitutions() {
  const [pendingInstitutions, setPendingInstitutions] = useState([]);
  const [currentPendingInstitutions, setCurrenPendingInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchPendingInstitutions = async () => {
      try {
        const response = await fetch(`/api/institutions/pending`, { method: "GET" });
        const result = await response.json();

        if (result.success) {
          setPendingInstitutions(result.data);
          handleCurrentItemsChange(result.data.slice(0, 10));
        } else {
          console.error("Error fetching pending institutions:", result.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingInstitutions();
  }, []);

  const handleCurrentItemsChange = (currentItems) => {
    setCurrenPendingInstitutions(currentItems);
  };

  const handleSearchChange = (result) => {
    if (result) {
      setCurrenPendingInstitutions([result]);
    } else {
      handleCurrentItemsChange(pendingInstitutions.slice(0, 10));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <Search
        className={styles.autocompleteInput}
        dataToSearch={pendingInstitutions}
        searchFields={['user_id', 'shortname', 'fullname', 'useed_code', 'admin_user_fullname']}
        onChange={handleSearchChange}
        placeholder="Шукати заклад..."
      />
      <AdminTable
        tableHeaders={['ID в базі даних', 'Повна назва', 'Код ЄДЕБО', 'Коротка назва', 'Стан', 'Тип закладу', 
        'Форма власності', 'Код КОАТУУ', 'Область', 'Населений пункт', 'Адреса', 'Орган, до сфери управління його належить заклад освіти', 'Телефон', 
        'Email', 'Веб-сайт', 'ПІБ директорки/директора', 'Акаунт адміністратора НЗ']}
        institutions={currentPendingInstitutions}
        crudLink={'/api/institutions/pending'}
        items={currentPendingInstitutions}
        onUpdateItems={handleCurrentItemsChange}
        uniqueField={'useed_code'}
        immutableFields={['id']}
      />
      <Pagination
        onCurrentItemsChange={handleCurrentItemsChange}
        items={pendingInstitutions}
        itemsPerPage={10}
        maxVisiblePages={7}
      />
    </div>
  );
}
