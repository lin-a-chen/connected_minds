'use client';

import React, { useEffect, useState } from "react";
import Loading from "@/components/modals/Loading";
import styles from "@/styles/main pages/AdminTablePage.module.scss";
import Pagination from "@/components/modals/Pagination";
import AdminTable from "@/components/main pages/admin/AdminTable";
import Search from "@/components/UI/Search";
import { LuCross } from "react-icons/lu";
import AddSchoolchild from "@/components/modals/AddSchoolchild";
import moment from 'moment';

export default function InstitutionAdminSchoolchildren() {
  const [schoolchildren, setSchoolchildren] = useState([]);
  const [currentSchoolchildren, setCurrentSchoolchildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addSchoolchildModalOpened, setAddSchoolchildModalOpened] = useState(false);

  useEffect(() => {

    const fetchSchoolchildren = async () => {
      try {
        const response = await fetch(`/api/institution/schoolchildren`, { method: "GET" });
        const result = await response.json();

        if (result.success) {
            const formattedData = result.data.map(el => {
                const obj = {id: el.id, firstname: el.firstname, lastname: el.lastname, antroponym: el.antroponym, class_name: el.class_name,
                     email: el.email, phone_number: el.phone_number, country: el.country, region: el.region,
                    settlement: el.settlement, address: el.address, birthdate: null, is_activated: true ? 'Так' : 'Ні'};
                const dateString = el.birthdate;
                const formattedDate = moment(dateString).format('DD.MM.YYYY');
                obj.birthdate = formattedDate;
                return obj;
            });
          setSchoolchildren(formattedData);
          handleCurrentItemsChange(formattedData.slice(0, 10));
        } else {
          console.error("Error fetching schoolchildren:", result.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolchildren();
  }, []);

  const handleCurrentItemsChange = (currentItems) => {
    setCurrentSchoolchildren(currentItems);
  };

  const handleSearchChange = (result) => {
    if (result) {
      setCurrentSchoolchildren([result]);
    } else {
      handleCurrentItemsChange(schoolchildren.slice(0, 10));
    }
  };

  if (loading) {
    return <Loading />;
  }

  const handleOpenAddAdmin = () => {
    setAddSchoolchildModalOpened(true);
  }

  const handleCloseAddAdmin = () => {
    setAddSchoolchildModalOpened(false);
  }

  return (
    <div className={styles.container}>
        <div className={styles.topPanel}>
            <button onClick={handleOpenAddAdmin} className={styles.addAdminButton}><LuCross/>Додати ученицю/учня</button>
            <Search
                className={styles.autocompleteInput}
                dataToSearch={schoolchildren}
                searchFields={['firstname', 'lastname', 'antroponym', 'email', 'phone_number', 'birthdate', 'country', 'region', 'settlement', 'address', 'class_name']}
                onChange={handleSearchChange}
                placeholder="Шукати ученицю/учня..."
            />
        </div>

        {<AddSchoolchild isVisible={addSchoolchildModalOpened} onClose={handleCloseAddAdmin}/>}
      
      <AdminTable
        tableHeaders={['Ім\'я', 'Прізвище', 'По-батькові чи по-матері', 'Клас', 'Email', 'Номер телефону', 'Країна', 'Область (чи інший регіон)', 'Населений пункт', 'Адреса', 'Дата народження', 'Акаунт активовано?']}
        crudLink={'/api/institution/schoolchildren'}
        items={currentSchoolchildren}
        onUpdateItems={handleCurrentItemsChange}
        uniqueField={'id'}
        immutableFields={['id', 'is_activated']}
        fieldsToHide={['id', 'institution_useed_code']}
      />
      <Pagination
        onCurrentItemsChange={handleCurrentItemsChange}
        items={schoolchildren}
        itemsPerPage={10}
        maxVisiblePages={7}
      />
    </div>
  );
}
