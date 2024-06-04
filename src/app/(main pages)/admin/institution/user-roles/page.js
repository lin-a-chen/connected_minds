'use client';

import React, { useEffect, useState } from "react";
import Loading from "@/components/modals/Loading";
import styles from "@/components/main pages/admin/AdminTablePage.module.scss";
import Pagination from "@/components/modals/Pagination";
import Search from "@/components/UI/AutocompleteInput/Search";
import AdminTableUserRoles from "@/components/main pages/admin/AdminTableUserRoles";
import standartStyles from "@/styles/Styles.module.scss";
import { AddRole } from "@/components/modals/AddRole";

export default function UserRoles() {
  const [userRoles, setUserRoles] = useState([]);
  const [currentUserRoles, setCurrentUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addRoleModuleVisible, setAddRoleModuleVisible] = useState(false);

  const fetchUserRoles = async () => {
    try {
      const userRolesJoinedResponse = await fetch(`/api/roles/user-roles?reqmode=compr`, { method: "GET" });
      const userRolesJoinedResult = await userRolesJoinedResponse.json();

      if (!userRolesJoinedResult.success) {
          throw new Error("Error fetching user roles:", userRolesJoinedResult.data);
      }

      const userRolesFormatted = userRolesJoinedResult.data.map(el => {
          console.log('el', el)
          return {id: el.id, user_id: el.user_id, username: el.username, role_id: el.role_id, role_name: el.role_name, institution_useed_code: el.institution_useed_code, institution_fullname: el.fullname}
      });

      setUserRoles(userRolesFormatted);
      handleCurrentItemsChange(userRolesFormatted.slice(0, 10));

    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const handleCurrentItemsChange = (currentItems) => {
    setCurrentUserRoles(currentItems);
  };

  const handleSearchChange = (result) => {
    if (result) {
      setCurrentUserRoles([result]);
    } else {
      handleCurrentItemsChange(userRoles.slice(0, 10));
    }
  };

  if (loading) {
    return <Loading />;
  }

  const handleClose = () => {
    fetchUserRoles()
    setAddRoleModuleVisible(false);
  }

  const handleOpen = () => {
    setAddRoleModuleVisible(true);
  }

  return (
    <div className={styles.container}>
      {addRoleModuleVisible && <AddRole isVisible={addRoleModuleVisible} onClose={handleClose}/>}
      <Search
        className={styles.autocompleteInput}
        dataToSearch={userRoles}
        searchFields={['id', 'user_id', 'role_id', 'institution_id']}
        onChange={handleSearchChange}
        placeholder="Шукати роль..."
      />
      <AdminTableUserRoles
        tableHeaders={['ID в базі даних', 'ID користувача', 'Username', 'ID ролі', 'Роль', 'ID закладу', 'Повна назва закладу']}
        crudLink={'/api/roles/user-roles'}
        items={currentUserRoles}
        onUpdateItems={handleCurrentItemsChange}
        uniqueField={'id'}
      />
      {!addRoleModuleVisible && <button className={`${standartStyles.buttonRegular}`} style={{margin: '1rem auto'}} onClick={handleOpen}>Додати роль</button>}
      <Pagination
        onCurrentItemsChange={handleCurrentItemsChange}
        items={userRoles}
        itemsPerPage={10}
        maxVisiblePages={7}
      />
    </div>
  );
}
