"use client";

import standartStyles from "@/styles/Styles.module.scss";
import styles from "./AcademicRecords.module.scss";
import { useState, useEffect, useRef } from "react";
import AutocompleteInput from "../../UI/AutocompleteInput";
import { toast } from "react-toastify";
import { FaChalkboardTeacher } from "react-icons/fa";

export default function AcademicRecords({ userRole, user }) {
	const [className, setClassName] = useState({ number: 1, letter: "А" });
	const [classLetters, setClassLetters] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [subject, setSubject] = useState({});
	const [classObj, setClassObj] = useState({});
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [year, setYear] = useState(new Date().getFullYear());
	const [selectedCell, setSelectedCell] = useState(null);
	const [showTinyPopup, setShowTinyPopup] = useState(false);
	const [popupData, setPopupData] = useState(null);
	const [academicRecords, setAcademicRecords] = useState([]);
	const [schoolchildren, setSchoolchildren] = useState([]);
	const [prevSelectedCell, setPrevSelectedCell] = useState({
		row: null,
		col: null,
	});
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const inputRef = useRef(null);
	const tableRef = useRef(null);
	const popupref = useRef(null);
	const tableContainerRef = useRef(null);

	const handleClassNumberChange = (e) => {
		setClassName((prev) => ({
			...prev,
			number: +e.target.value,
		}));
	};

	const handleClassLetterChange = (e) => {
		setClassName((prev) => ({
			...prev,
			letter: e.target.value,
		}));
	};

	const fetchClasses = async () => {
		const response = await fetch(`/api/institution/classes`);
		const result = await response.json();
		if (!result.success) {
			console.error(result.data);
		}

		const letters = result.data.map((el) => el.name.split("-")[1]);
		const uniqueLetters = [...new Set(letters)];
		setClassLetters(uniqueLetters);
	};

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
					formatted.push(el.name);
				}
			});
			setSubjects(formatted);
		} else {
			setSubjects(result.data);
		}
	};

	const fetchSchoolChildren = async () => {
		if (className) {
			const response = await fetch(
				`/api/institution/schoolchildren?class=${className.number}-${className.letter}`
			);
			const result = await response.json();
			if (!result.success) {
				console.error(result.data);
				return;
			}

			const sortByLastName = (a, b) => {
				const lastNameA = a.lastname.toUpperCase();
				const lastNameB = b.lastname.toUpperCase();

				if (lastNameA < lastNameB) {
					return -1;
				}
				if (lastNameA > lastNameB) {
					return 1;
				}
				return 0;
			};

			const sortedSchoolchildren = result.data.sort(sortByLastName);

			setSchoolchildren(sortedSchoolchildren);
		} else setSchoolchildren([]);
	};

	const fetchRecords = async () => {
		if (classObj && subject && subject.length > 0) {
			const response = await fetch(
				`/api/institution/academic-records?class=${classObj.name}&subject=${subject}`
			);
			const result = await response.json();
			if (!result.success) {
				console.error(result.data);
				return;
			}

			const filteredByMonth = [];
			result.data.academic_records.forEach((el) => {
				const date = new Date(el.date);
				const dateMonth = date.getMonth() + 1;
				const dateYear = date.getFullYear();
				if (dateMonth === month && dateYear === year) {
					filteredByMonth.push(el);
				}
			});

			const academicRecordsTransformed = filteredByMonth.reduce(
				(acc, obj) => {
					const { student_id, ...academicRecord } = obj;
					acc.push({ [student_id]: academicRecord });
					return acc;
				},
				[]
			);

			setAcademicRecords(academicRecordsTransformed);
		}
	};

	useEffect(() => {
		fetchClasses();
	}, []);

	const fetchClass = async () => {
		if (className){
			const response = await fetch(
			`/api/institution/classes?class=${className.number}-${className.letter}`
		);
		const result = await response.json();
		if (!result.success) {
			console.error(result.data);
		}

		setClassObj(result.data);
		}
		
	};

	useEffect(() => {
		fetchClass();
	}, [className.letter, className.number]);

	useEffect(() => {
		fetchSubjects();
		fetchSchoolChildren();
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

	const handleCellDoubleClick = (rowIndex, colIndex) => {
		if (!subject.length || subject.length === 0) {
			toast.error("Спочатку оберіть предмет");
			return;
		}
		setSelectedCell({ row: rowIndex, col: colIndex });
	};

	const handleKeyDown = async (event) => {
		if (event.key === "Enter") {
			const { relatedTarget } = event;
			if (
				selectedCell &&
				(!relatedTarget || !tableRef.current.contains(relatedTarget))
			) {
				if (!isRequestInProgress) {
					const subjectName = subject;
					const classesType = classObj.type;
					const date = `${
						selectedCell.col + 1 < 10
							? "0" + (selectedCell.col + 1)
							: selectedCell.col + 1
					}.${month < 10 ? "0" + month : month}.`;
					setPrevSelectedCell((prev) => ({
						...prev,
						row: selectedCell.row,
						col: selectedCell.col,
					}));
					setSelectedCell(null);
					const data = {
						grade: null,
						present: null,
						subjectName: subjectName,
						classesType: classesType,
						classId: classObj.id,
						studentId: schoolchildren[selectedCell.row].id,
						teacherUserId: user.id,
						date: date,
					};
					if (
						parseInt(event.target.value) &&
						(parseInt(event.target.value) > 1 ||
							parseInt(event.target.value) < 12)
					) {
						data.present = 1;
						data.grade = parseInt(event.target.value);
					} else if (event.target.value.toLowerCase() === "н") {
						data.present = 0;
						data.grade = null;
					} else if (event.target.value === "") {
						data.present = 1;
						data.grade = null;
					} else {
						toast.error(
							'В клітинці може бути лише оцінка від 1 до 12, "н-ка" або зовсім нічого'
						);
						toast.error(
							'В клітинці може бути лише оцінка від 1 до 12, "н-ка" або зовсім нічого'
						);
						return;
					}
					setIsRequestInProgress(true);
					const response = await fetch(
						`/api/institution/academic-records`,
						{
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(data),
						}
					);
					const result = await response.json();
					if (!result.success) {
						toast.error(result.data);
						setIsRequestInProgress(false);
					} else {
						toast.success(result.data);
						setIsRequestInProgress(false);
						fetchRecords();
					}
				}
			}
		}
	};

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
		document.body.addEventListener("keydown", handleKeyDown);
		document.body.addEventListener("focusout", handleCellBlur);

		return () => {
			document.body.removeEventListener("keydown", handleKeyDown);
			document.body.removeEventListener("focusout", handleCellBlur);
		};
	}, [selectedCell]);


	const getRecord = (rowIndex, colIndex) => {
		if (academicRecords && academicRecords.length > 0) {
			if (schoolchildren[rowIndex]) {
				let currentStudentRecords = [];
				const date = `${
					colIndex + 1 < 10 ? "0" + (colIndex + 1) : colIndex + 1
				}.${month < 10 ? "0" + month : month}.`;

				academicRecords.forEach((el) => {
					for (let key in el) {
						if (key === schoolchildren[rowIndex].id) {
							currentStudentRecords.push({
								student_id: key,
								...el[key],
							});
						}
					}
				});

				if (currentStudentRecords && currentStudentRecords.length > 0) {
					for (let record of currentStudentRecords) {
						const recordDateObj = new Date(record.date);
						const recordMonth = recordDateObj.getMonth() + 1;
						const recordDate = `${
							recordDateObj.getDate() < 10
								? `0${recordDateObj.getDate()}`
								: recordDateObj.getDate()
						}.${
							recordMonth < 10 ? "0" + recordMonth : recordMonth
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

	const renderCellContent = (rowIndex, colIndex) => {
		const isEditable = true;

		if (
			selectedCell &&
			selectedCell.row === rowIndex &&
			selectedCell.col === colIndex &&
			isEditable
		) {
			return (
				<input
					ref={inputRef}
					type="text"
					defaultValue={""}
					onBlur={handleCellBlur}
					onKeyDown={handleKeyDown}
					className="editable-cell"
				/>
			);
		} else {
			if (academicRecords && academicRecords.length > 0) {
				if (schoolchildren[rowIndex]) {
					let currentStudentRecords = [];
					const date = `${
						colIndex + 1 < 10 ? "0" + (colIndex + 1) : colIndex + 1
					}.${month < 10 ? "0" + month : month}.`;

					academicRecords.forEach((el) => {
						for (let key in el) {
							if (key === schoolchildren[rowIndex].id) {
								currentStudentRecords.push({
									student_id: key,
									...el[key],
								});
							}
						}
					});

					if (
						currentStudentRecords &&
						currentStudentRecords.length > 0
					) {
						for (let record of currentStudentRecords) {
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
								return record.grade !== undefined
									? record.grade
									: "";
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

		if (schoolchildren) {
			for (let i = 0; i < schoolchildren.length; i++) {
				const cells = [];
				cells.push(
					<td key={`pib${i}`}>
						<a
							href={`/api/institution/schoolchild/${schoolchildren[i].id}`}>{`${schoolchildren[i].lastname} ${schoolchildren[i].firstname}`}</a>
					</td>
				);
				for (let j = 0; j < daysInMonth; j++) {
					cells.push(
						<td
							key={j}
							onDoubleClick={() => handleCellDoubleClick(i, j)}
							onMouseEnter={(e) => handleShowTinyPopup(e, i, j)}
							onMouseLeave={(e) => setShowTinyPopup(false)}>
							{isRequestInProgress &&
							prevSelectedCell &&
							prevSelectedCell.row === i &&
							prevSelectedCell.col === j ? (
								<span className={styles.loader}></span>
							) : (
								renderCellContent(i, j)
							)}
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
						popupref.current.style.left =
							e.target.offsetLeft + "px";
						popupref.current.style.top =
							e.target.offsetTop + 48 + "px";
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
				{userRole !== 'SCHOOLCHILD' && <div>
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
				</div>}
				<div>
					<label>Предмет*</label>
					<AutocompleteInput
						dataToSearch={subjects}
						onChange={handleOnChangeSubject}
						defaultValue={subject ? subject.name : ""}
					/>
				</div>
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
							<span>ПІБ учениці/учня</span>
						</div>
						<div>
							<span>Дата</span>
						</div>
					</div>
					{subject && month && (
						<table ref={tableRef}>
							<tbody>{renderTableCells()}</tbody>
						</table>
					)}

					{showTinyPopup && subject && renderPopup()}
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
