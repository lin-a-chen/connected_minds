'use client';

import React, { useEffect, useState } from "react";
import Loading from "@/components/modals/Loading";
import styles from "@/styles/main pages/AdminTablePage.module.scss";
import Pagination from "@/components/modals/Pagination";
import AdminTable from "@/components/main pages/admin/AdminTable";
import Search from "@/components/UI/Search";
import { LuCross } from "react-icons/lu";
import AddSubject from "@/components/modals/AddSubject";
export default function InstitutionAdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [currentSubjects, setCurrentSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addSubjectOpened, setAddSubjectOpened] = useState(false);

  useEffect(() => {

    const fetchSubjects = async () => {
      try {
        const response = await fetch(`/api/institution/subjects`, { method: "GET" });
        const result = await response.json();

        if (result.success) {
          setSubjects(result.data);
          handleCurrentItemsChange(result.data.slice(0, 10));
        } else {
          console.error("Error fetching subjects:", result.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleCurrentItemsChange = (currentItems) => {
    setCurrentSubjects(currentItems);
  };

  const handleSearchChange = (result) => {
    if (result) {
      setCurrentSubjects([result]);
    } else {
      handleCurrentItemsChange(subjects.slice(0, 10));
    }
  };

  if (loading) {
    return <Loading />;
  }

  const handleOpenAddAdmin = () => {
    setAddSubjectOpened(true);
  }

  const handleCloseAddAdmin = () => {
    setAddSubjectOpened(false);
  }

  return (
    <div className={styles.container}>
        <div className={styles.topPanel}>
            <button onClick={handleOpenAddAdmin} className={styles.addAdminButton}><LuCross/>Додати предмет</button>
            <Search
                className={styles.autocompleteInput}
                dataToSearch={subjects}
                searchFields={['name', 'classes_type']}
                onChange={handleSearchChange}
                placeholder="Шукати предмет..."
            />
        </div>

        {<AddSubject isVisible={addSubjectOpened} onClose={handleCloseAddAdmin}/>}
      
      <AdminTable
        tableHeaders={['Назва предмету', 'Для якої школи']}
        crudLink={'/api/institution/subjects'}
        items={currentSubjects}
        onUpdateItems={handleCurrentItemsChange}
        uniqueField={'id'}
        immutableFields={['id']}
        fieldsToHide={['id']}
      />
      <Pagination
        onCurrentItemsChange={handleCurrentItemsChange}
        items={subjects}
        itemsPerPage={10}
        maxVisiblePages={7}
      />
    </div>
  );
}
