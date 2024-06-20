// 'use client';

// import React, { useEffect, useState } from "react";
// import Loading from "@/components/modals/Loading";
// import styles from "@/components/main pages/admin/AdminTablePage.module.scss";
// import Pagination from "@/components/modals/Pagination";
// import AdminTable from "@/components/main pages/admin/AdminTable";
// import Search from "@/components/UI/AutocompleteInput/Search";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [currentUsers, setCurrentUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch(`/api/users`, { method: "GET" });
//       const result = await response.json();

//       if (result.success) {
//         setUsers(result.data);
//         handleCurrentItemsChange(result.data.slice(0, 10));
//       } else {
//         console.error("Error fetching users:", result.data);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleCurrentItemsChange = (currentItems) => {
//     setCurrentUsers(currentItems);
//   };

//   const handleSearchChange = (result) => {
//     if (result) {
//       setCurrentUsers([result]);
//     } else {
//       handleCurrentItemsChange(users.slice(0, 10));
//     }
//   };

//   const handleUpdate = () => {
//     fetchUsers();
//   }

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div className={styles.container}>
//       <Search
//         className={styles.autocompleteInput}
//         dataToSearch={users}
//         searchFields={['id', 'email', 'phone_number']}
//         onChange={handleSearchChange}
//         placeholder="Шукати користувача..."
//       />
//       <AdminTable
//         tableHeaders={['ID в базі даних', 'Email', 'Номер телефону', 'Статус (чи активовано)', 'Дата створення', 'Email токен', 'Email токен дійсний до:', 'Фото']}
//         crudLink={'/api/users'}
//         items={currentUsers}
//         onUpdateItems={handleUpdate}
//         uniqueField={'id'}
//         immutableFields={['id', 'password', 'created_at']}
//         fieldsToHide={['password']}
//       />
//       <Pagination
//         onCurrentItemsChange={handleCurrentItemsChange}
//         items={users}
//         itemsPerPage={10}
//         maxVisiblePages={7}
//       />
//     </div>
//   );
// }

'use client';

import React, { useEffect, useState } from "react";
import Loading from "@/components/modals/Loading";
import styles from "@/components/main pages/admin/AdminTablePage.module.scss";
import Pagination from "@/components/modals/Pagination";
import AdminTable from "@/components/main pages/admin/AdminTable";
import Search from "@/components/UI/AutocompleteInput/Search";
import { toast } from "react-toastify";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
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

  const handleUpdateItems = (updatedItems) => {
    setUsers(updatedItems);
    setCurrentUsers(updatedItems.slice(0, 10));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <Search
        className={styles.autocompleteInput}
        dataToSearch={users}
        searchFields={['id', 'email', 'phone_number']}
        onChange={handleSearchChange}
        placeholder="Шукати користувача..."
      />
      <AdminTable
        tableHeaders={['ID в базі даних', 'Email', 'Номер телефону', 'Статус (чи активовано)', 'Дата створення', 'Email токен', 'Email токен дійсний до:', 'Фото']}
        crudLink={'/api/users'}
        items={currentUsers}
        onUpdateItems={handleUpdateItems}
        uniqueField={'id'}
        immutableFields={['id', 'password', 'created_at']}
        fieldsToHide={['password']}
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
