'use client';

import React, { useEffect, useState } from "react";
import Loading from "@/components/modals/Loading";
import styles from "@/components/main pages/admin/AdminTablePage.module.scss";
import Pagination from "@/components/modals/Pagination";
import AdminTableRequests from "@/components/main pages/admin/AdminTableRequests";
import Search from "@/components/UI/AutocompleteInput/Search";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [currentRequests, setCurrentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestUpdateSuccessful, setRequestUpdateSuccessful] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`/api/requests`, { method: "GET" });
        const result = await response.json();

        if (result.success) {
          setRequests(result.data);
          handleCurrentItemsChange(result.data.slice(0, 10));
        } else {
          console.error("Error fetching requests:", result.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [requestUpdateSuccessful]);

  const handleCurrentItemsChange = (currentItems) => {
    setCurrentRequests(currentItems);
  };

  const handleSearchChange = (result) => {
    if (result) {
      setCurrentRequests([result]);
    } else {
      handleCurrentItemsChange(requests.slice(0, 10));
    }
  };

  if (loading) {
    return <Loading />;
  }

  const handleRequestStatusChange = async (success) => {
    setRequestUpdateSuccessful(success);
  }

  return (
    <div className={styles.container}>
      <Search
        className={styles.autocompleteInput}
        dataToSearch={requests}
        searchFields={['user_id', 'subject']}
        onChange={handleSearchChange}
        placeholder="Шукати заявку..."
      />
      <AdminTableRequests
        tableHeaders={['ID в базі даних', 'Заявник (ID)', 'Тип', 'Предмет заявки', 'Опис', 'Статус', 'Дата створення', 'Дата оновлення']}
        crudLink={'/api/requests'}
        items={currentRequests}
        onUpdateItems={handleCurrentItemsChange}
        uniqueField={'id'}
        immutableFields={['id', 'user_id', 'created_at', 'updated_at' ]}
        onApprove={handleRequestStatusChange}
        onDeny={handleRequestStatusChange}
      />
      <Pagination
        onCurrentItemsChange={handleCurrentItemsChange}
        items={requests}
        itemsPerPage={10}
        maxVisiblePages={7}
      />
    </div>
  );
}
