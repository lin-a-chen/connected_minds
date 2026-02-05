'use client';

import React, { useEffect, useState } from "react";
import Loading from "@/components/modals/Loading";
import styles from "@/styles/main pages/AdminTablePage.module.scss";
import Pagination from "@/components/modals/Pagination";
import AdminTable from "@/components/main pages/admin/AdminTable";
import Search from "@/components/UI/Search";
import { LuCross } from "react-icons/lu";
import AddTeacher from "@/components/modals/AddTeacher";
import moment from 'moment';

export default function InstitutionAdminTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [currentTeachers, setCurrentTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addTeacherModalOpened, setAddTeacherModalOpened] = useState(false);

  useEffect(() => {

    const fetchTeachers = async () => {
      try {
        const response = await fetch(`/api/institution/teachers`, { method: "GET" });
        const result = await response.json();

        if (result.success) {
            const formattedData = result.data.map(el => {
                const obj = {id: el.id, firstname: el.firstname, lastname: el.lastname, antroponym: el.antroponym, position: el.position,
                     email: el.email, phone_number: el.phone_number, country: el.country, region: el.region,
                    settlement: el.settlement, address: el.address, birthdate: null, is_activated: true ? 'Так' : 'Ні'};
                const dateString = el.birthdate;
                const formattedDate = moment(dateString).format('DD.MM.YYYY');
                obj.birthdate = formattedDate;
                return obj;
            });
          setTeachers(formattedData);
          handleCurrentItemsChange(formattedData.slice(0, 10));
        } else {
          console.error("Error fetching teachers:", result.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleCurrentItemsChange = (currentItems) => {
    setCurrentTeachers(currentItems);
  };

  const handleSearchChange = (result) => {
    if (result) {
      setCurrentTeachers([result]);
    } else {
      handleCurrentItemsChange(teachers.slice(0, 10));
    }
  };

  if (loading) {
    return <Loading />;
  }

  const handleOpenAddAdmin = () => {
    setAddTeacherModalOpened(true);
  }

  const handleCloseAddAdmin = () => {
    setAddTeacherModalOpened(false);
  }

  return (
    <div className={styles.container}>
        <div className={styles.topPanel}>
            <button onClick={handleOpenAddAdmin} className={styles.addAdminButton}><LuCross/>Додати вчительку/вчителя</button>
            <Search
                className={styles.autocompleteInput}
                dataToSearch={teachers}
                searchFields={['firstname', 'lastname', 'antroponym', 'email', 'phone_number', 'birthdate', 'country', 'region', 'settlement', 'address', 'position']}
                onChange={handleSearchChange}
                placeholder="Шукати вчительку/вчителя..."
            />
        </div>

        {<AddTeacher isVisible={addTeacherModalOpened} onClose={handleCloseAddAdmin}/>}
      
      <AdminTable
        tableHeaders={['Ім\'я', 'Прізвище', 'По-батькові чи по-матері', 'Посада', 'Email', 'Номер телефону', 'Країна', 'Область (чи інший регіон)', 'Населений пункт', 'Адреса', 'Дата народження', 'Акаунт активовано?']}
        crudLink={'/api/institution/teachers'}
        items={currentTeachers}
        onUpdateItems={handleCurrentItemsChange}
        uniqueField={'id'}
        immutableFields={['id', 'is_activated']}
        fieldsToHide={['id', 'institution_useed_code']}
      />
      <Pagination
        onCurrentItemsChange={handleCurrentItemsChange}
        items={teachers}
        itemsPerPage={10}
        maxVisiblePages={7}
      />
    </div>
  );
}
