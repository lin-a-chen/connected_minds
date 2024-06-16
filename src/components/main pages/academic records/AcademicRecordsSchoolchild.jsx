"use client";

import standartStyles from "@/styles/Styles.module.scss";
import styles from "./AcademicRecords.module.scss";
import { useState, useEffect, useRef } from "react";
import AutocompleteInput from "../../UI/AutocompleteInput";
import { toast } from "react-toastify";
import { FaChalkboardTeacher } from "react-icons/fa";

export default function AcademicRecords({ userRole, user }) {
	const [subjects, setSubjects] = useState([]);
	const [classObj, setClassObj] = useState({});
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [year, setYear] = useState(new Date().getFullYear());
	const [selectedCell, setSelectedCell] = useState(null);
	const [showTinyPopup, setShowTinyPopup] = useState(false);
	const [popupData, setPopupData] = useState(null);
	const [academicRecords, setAcademicRecords] = useState([]);
	const [schoolchild, setSchoolchild] = useState([]);

	const inputRef = useRef(null);
	const tableRef = useRef(null);
	const popupref = useRef(null);
	const tableContainerRef = useRef(null);

	const fetchSubjects = async () => {
		const response = await fetch(`/api/institution/subjects`);
		const result = await response.json();
		if (!result.success) {
			console.error(result.data);
		}

		const formatted = [];

		if (classObj) {
			result.data.forEach((el) => {
				if (el.classes_type === classObj.type) {
					formatted.push(el);
				}
			});

			setSubjects(formatted);
		} else {
			setSubjects(result.data);
		}
	};

	const fetchSchoolChild = async () => {
		const response = await fetch(
			`/api/institution/schoolchildren?user-id=${user.id}`
		);
		const result = await response.json();
		setSchoolchild(result.data);

		const classNumber = result.data.class_name.split("-")[0];
		const type = classNumber < 5 ? "Молодша школа" : "Старша школа";
		setClassObj({ name: result.data.class_name, type: type });
		if (!result.success) {
			console.error(result.data);
			return;
		}
	};

	const fetchRecords = async () => {
		if (classObj && subjects && subjects.length > 0) {
			const response = await fetch(`/api/institution/academic-records?schoolchild=${schoolchild.id}`);
			const result = await response.json();
	
			if (!result.success) {
				console.error(result.data);
				return;
			}

			
				
			const filteredByMonth = [];
			result.data.forEach((el) => {
				const date = new Date(el.date);
				const dateMonth = date.getMonth() + 1;
				const dateYear = date.getFullYear();
				if (dateMonth === month && dateYear === year) {
					filteredByMonth.push(el);
				}
			});
		
			setAcademicRecords(filteredByMonth);
		}
	};

	useEffect(() => {
		fetchSchoolChild();
	}, []);

	useEffect(() => {
		fetchSubjects();
	}, [classObj]);

	useEffect(() => {
		fetchRecords();
	}, [month, year, classObj]);

	const handleOnChangeSubject = (value) => {
		if (value) {
			setSubject(value);
		}
	};

	const handlePrevMonth = () => {
		setMonth((prevMonth) => {
			if (prevMonth === 1) {
				setYear((prevYear) => prevYear - 1);
				return 12;
			} else {
				return prevMonth - 1;
			}
		});
	};

	const handleNextMonth = () => {
		setMonth((prevMonth) => {
			if (prevMonth === 12) {
				setYear((prevYear) => prevYear + 1);
				return 1;
			} else {
				return prevMonth + 1;
			}
		});
	};

	const handleMonthChange = (e) => {
		setMonth(parseInt(e.target.value));
	};

	useEffect(() => {
		if (selectedCell) {
			inputRef.current.focus();
		}
	}, [selectedCell]);

	const handleCellBlur = async (event) => {
		const { relatedTarget } = event;
		if (
			selectedCell &&
			(!relatedTarget || !tableRef.current.contains(relatedTarget))
		) {
			setSelectedCell(null);
		}
	};

	useEffect(() => {
		document.body.addEventListener("focusout", handleCellBlur);

		return () => {
			document.body.removeEventListener("focusout", handleCellBlur);
		};
	}, [selectedCell]);

	const getRecord = (rowIndex, colIndex) => {
		if (academicRecords && academicRecords.length > 0) {

			if (subjects[rowIndex] && academicRecords) {

				let currentSubjectRecords = [];
				const date = `${
					colIndex + 1 < 10 ? "0" + (colIndex + 1) : colIndex + 1
				}.${month < 10 ? "0" + month : month}.`;

				academicRecords.forEach((el) => {
					if ((el.subject_id === subjects[rowIndex].id)) {
						currentSubjectRecords.push(el);
					}
				});

				if (
					currentSubjectRecords &&
					currentSubjectRecords.length > 0
				) {
					for (let record of currentSubjectRecords) {
						const recordDateObj = new Date(record.date);
						const recordMonth = recordDateObj.getMonth() + 1;
						const recordDate = `${
							recordDateObj.getDate() < 10
								? `0${recordDateObj.getDate()}`
								: recordDateObj.getDate()
						}.${
							recordMonth < 10
								? "0" + recordMonth
								: recordMonth
						}.`;

						
						if (recordDate === date) {

							return record

							
						}
					}
				}
			}
		}
	};

	const renderCellContent = (rowIndex, colIndex) => {
		if (academicRecords && academicRecords.length > 0) {

			if (subjects[rowIndex] && academicRecords) {

				let currentSubjectRecords = [];
				const date = `${
					colIndex + 1 < 10 ? "0" + (colIndex + 1) : colIndex + 1
				}.${month < 10 ? "0" + month : month}.`;

				academicRecords.forEach((el) => {
					if ((el.subject_id === subjects[rowIndex].id)) {
						currentSubjectRecords.push(el);
					}
				});

				if (
					currentSubjectRecords &&
					currentSubjectRecords.length > 0
				) {
					for (let record of currentSubjectRecords) {
						const recordDateObj = new Date(record.date);
						const recordMonth = recordDateObj.getMonth() + 1;
						const recordDate = `${
							recordDateObj.getDate() < 10
								? `0${recordDateObj.getDate()}`
								: recordDateObj.getDate()
						}.${
							recordMonth < 10
								? "0" + recordMonth
								: recordMonth
						}.`;

						
						if (recordDate === date) {
	
							if (record.present){
								return record.grade !== undefined
								? record.grade
								: "";
							}
							else{
								return 'н';
							}

							
						}
					}
				}
			}
		}
	};

	const renderTableCells = () => {
		const daysInMonth = new Date(year, month, 0).getDate();
		const rows = [];
		const dateCells = [];
		for (let i = 1; i <= daysInMonth; i++) {
			dateCells.push(
				<td key={i}>{`${i < 10 ? "0" + i : i}.${
					month < 10 ? "0" + month : month
				}.`}</td>
			);
		}
		rows.push(
			<tr key={"datarow"}>
				<td key={"emptycell"}></td>
				{dateCells}
			</tr>
		);

		if (schoolchild) {
			for (let i = 0; i < subjects.length; i++) {
				const cells = [];
				cells.push(
					<td key={`subjects${i}`}>
						<span>{subjects[i].name}</span>
					</td>
				);

				for (let j = 0; j < daysInMonth; j++) {
					cells.push(
						<td
							key={j}
							onMouseEnter={(e) => handleShowTinyPopup(e, i, j)}
							onMouseLeave={(e) => setShowTinyPopup(false)}>
							{renderCellContent(i, j)}
						</td>
					);
				}
				rows.push(<tr key={`gradeRow${i}`}>{cells}</tr>);
			}
		}

		return rows;
	};

	const handleScroll = () => {
		setShowTinyPopup(false);
	};

	useEffect(() => {
		if (tableContainerRef.current) {
			tableContainerRef.current.addEventListener("scroll", handleScroll);
		}

		return () => {
			if (tableContainerRef.current) {
				tableContainerRef.current.removeEventListener(
					"scroll",
					handleScroll
				);
			}
		};
	}, []);

	const handleShowTinyPopup = (e, rowIndex, colIndex) => {
		const record = getRecord(rowIndex, colIndex);

		if (record) {
			setShowTinyPopup(true);
			setPopupData((prev) => ({
				...prev,
				teacherId: record.teacher_user_id,
				teacherFirstname: record.teacher_firstname,
				teacherLastname: record.teacher_lastname,
				teacherAntroponym: record.teacher_antroponym,
			}));

			setTimeout(() => {
				if (record && popupref.current) {
					popupref.current.style.left = e.target.offsetLeft + "px";
					popupref.current.style.top = e.target.offsetTop + 48 + "px";
				} else {
					return;
				}
			}, 800);
		}
	};

	const renderPopup = () => {
		if (popupData) {
			return (
				<div
					ref={popupref}
					className={styles.popup}
					onMouseEnter={(e) => setShowTinyPopup(true)}
					onMouseLeave={(e) => setShowTinyPopup(false)}>
					<FaChalkboardTeacher />{" "}
					<a
						href={`/user/teacher/${popupData.teacherId}`}>{`${popupData.teacherLastname} ${popupData.teacherFirstname[0]}.${popupData.teacherAntroponym[0]}.`}</a>
				</div>
			);
		}
	};

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				{userRole !== "SCHOOLCHILD" && (
					<div>
						<label>Клас*</label>
						<div>
							<input
								className={standartStyles.inputRegular}
								defaultValue="1"
								type="number"
								min="1"
								max="11"
								placeholder="1"
								onChange={handleClassNumberChange}
							/>
							<select
								className={standartStyles.selectRegular}
								onChange={handleClassLetterChange}>
								{classLetters &&
									classLetters.map((el, index) => (
										<option
											key={index}
											value={el}>
											{el}
										</option>
									))}
							</select>
						</div>
					</div>
				)}
				<div>
					<label>Місяць*</label>
					<select
						className={standartStyles.selectRegular}
						onChange={handleMonthChange}
						value={month}>
						<option value="1">Січень</option>
						<option value="2">Лютий</option>
						<option value="3">Березень</option>
						<option value="4">Квітень</option>
						<option value="5">Травень</option>
						<option value="6">Червень</option>
						<option value="7">Липень</option>
						<option value="8">Серпень</option>
						<option value="9">Вересень</option>
						<option value="10">Жовтень</option>
						<option value="11">Листопад</option>
						<option value="12">Грудень</option>
					</select>
				</div>
			</div>
			<div className={styles.tableContainerAndArrows}>
				<button
					className={styles.buttonArrow}
					onClick={handlePrevMonth}>
					&lt;
				</button>

				<div
					className={styles.tableContainer}
					ref={tableContainerRef}
					onBlur={handleCellBlur}>
					<div className={styles.tableHeaders}>
						<div>
							<span>Предмет</span>
						</div>
						<div>
							<span>Дата</span>
						</div>
					</div>
					{subjects && month && (
						<table ref={tableRef}>
							<tbody>{renderTableCells()}</tbody>
						</table>
					)}

					{showTinyPopup && subjects && renderPopup()}
				</div>
				<button
					className={styles.buttonArrow}
					onClick={handleNextMonth}>
					&gt;
				</button>
			</div>
		</div>
	);
}
