'use client';

import React, { useEffect, useState } from "react";
import Loading from "@/components/modals/Loading";
import styles from "@/components/main pages/admin/AdminTablePage.module.scss";
import Pagination from "@/components/modals/Pagination";
import AdminTable from "@/components/main pages/admin/AdminTable";
import Search from "@/components/UI/AutocompleteInput/Search";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/users`, { method: "GET" });
        const result = await response.json();

        if (result.success) {
          setUsers(result.data);
          handleCurrentItemsChange(result.data.slice(0, 10));
        } else {
          console.error("Error fetching users:", result.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCurrentItemsChange = (currentItems) => {
    setCurrentUsers(currentItems);
  };

  const handleSearchChange = (result) => {
    if (result) {
      setCurrentUsers([result]);
    } else {
      handleCurrentItemsChange(users.slice(0, 10));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <Search
        className={styles.autocompleteInput}
        dataToSearch={users}
        searchFields={['id', 'username', 'email', 'phone_number']}
        onChange={handleSearchChange}
        placeholder="Шукати користувача..."
      />
      <AdminTable
        tableHeaders={['ID в базі даних', 'Username', 'Email', 'Номер телефону', 'Пароль', 'Статус (чи активовано)', 'Дата створення', 'Email токен', 'Email токен дійсний до:']}
        crudLink={'/api/users'}
        items={currentUsers}
        onUpdateItems={handleCurrentItemsChange}
        uniqueField={'id'}
        immutableFields={['id', 'password', 'created_at']}
      />
      <Pagination
        onCurrentItemsChange={handleCurrentItemsChange}
        items={users}
        itemsPerPage={10}
        maxVisiblePages={7}
      />
    </div>
  );
}
