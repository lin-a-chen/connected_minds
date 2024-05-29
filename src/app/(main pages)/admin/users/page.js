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
          const formattedUsers = result.data.map(el => {
            return {user_id: el.user_id, firstname: el.firstname, lastname: el.lastname, antroponym: el.antroponym, username: el.username, email: el.email, phone_number: el.phone_number, region: el.region, settlement: el.settlement, district: el.district, address: el.address};
          });
          setUsers(formattedUsers);
          handleCurrentItemsChange(formattedUsers.slice(0, 10));
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
        searchFields={['firstname', 'lastname', 'antroponym', 'email', 'phone_number', 'username']}
        onChange={handleSearchChange}
        placeholder="Шукати користувача..."
      />
      <AdminTable
        tableHeaders={['ID в базі даних', 'Ім\'я', 'Прізвище', 'По-батькові', 'Username', 'Email', 'Номер телефону', 'Область', 'Населений пункт', 'Район', 'Адреса']}
        crudLink={'/api/users'}
        items={currentUsers}
        onUpdateItems={handleCurrentItemsChange}
        uniqueField={'user_id'}
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
