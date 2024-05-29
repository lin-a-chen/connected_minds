'use client';

import AutocompleteInput from "@/components/UI/AutocompleteInput/AutocompleteInput";
import { useEffect, useState } from "react";
import Loading from "@/components/modals/Loading";
import styles from "./Institutions.module.scss";
import Pagination from "@/components/modals/Pagination";
import InstitutionsTable from "@/components/main pages/admin/InstitutionsTable";

export default function Institutions() {
  const [institutions, setInstitutions] = useState([]);
  const [currentInstitutions, setCurrentInstitutions] = useState([]);

  useEffect(() => {
    const fetchInstitutions = async () => {
      const response = await fetch(`/api/institutions`, { method: "GET" });
      const result = await response.json();
      if (result.success) {
        setInstitutions(result.data);
        handleCurrentItemsChange(result.data.slice(0, 10)); // Initial pagination setup
      } else {
        console.error(result.data);
      }
    };
    fetchInstitutions();
  }, []);

  const handleCurrentItemsChange = (currentItems) => {
    setCurrentInstitutions(currentItems);
  }

  return (
    <>
      {institutions.length === 0 ? <Loading /> : 
      <div className={styles.container}>
        <AutocompleteInput  dataToSearch={institutions} className={styles.autocompleteInput} />
        <InstitutionsTable
          institutions={currentInstitutions}
          onUpdateInstitutions={handleCurrentItemsChange}
        />
        <Pagination
          onCurrentItemsChange={handleCurrentItemsChange}
          items={institutions}
          itemsPerPage={10}
          maxVisiblePages={7}
        />
      </div>}
    </>
  );
}
