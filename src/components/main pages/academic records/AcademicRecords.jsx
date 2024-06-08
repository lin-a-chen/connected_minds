// "use client";

// import standartStyles from "@/styles/Styles.module.scss";
// import styles from "./AcademicRecords.module.scss";
// import { useState, useEffect } from "react";
// import AutocompleteInput from "../../UI/AutocompleteInput";

// export default function AcademicRecords({ userRole }) {
// 	const [className, setClassName] = useState({ number: 1, letter: "А" });
// 	const [classLetters, setClassLetters] = useState([]);
// 	const [subjects, setSubjects] = useState([]);
// 	const [subject, setSubject] = useState({});
// 	const [classObj, setClassObj] = useState({});

// 	const handleClassNumberChange = (e) => {
// 		setClassName((prev) => ({
// 			...prev,
// 			number: +e.target.value,
// 		}));
// 	};

// 	const handleClassLetterChange = (e) => {
// 		setClassName((prev) => ({
// 			...prev,
// 			letter: e.target.value,
// 		}));
// 	};

// 	const fetchClasses = async () => {
// 		const response = await fetch(`/api/institution/classes`);
// 		const result = await response.json();
// 		if (!result.success) {
// 			console.error(result.data);
// 		}

// 		const letters = result.data.map((el) => el.name.split("-")[1]);
// 		const uniqueLetters = [...new Set(letters)];
// 		setClassLetters(uniqueLetters);
// 	};

// 	const fetchSubjects = async () => {
// 		const response = await fetch(`/api/institution/subjects`);
// 		const result = await response.json();
// 		if (!result.success) {
// 			console.error(result.data);
// 		}

// 		const formatted = [];

// 		if (classObj) {
// 			result.data.forEach((el) => {
// 				if (el.classes_type === classObj.type) {
// 					formatted.push(el.name);
// 				}
// 			});
// 			console.log("formatted", formatted);
// 			setSubjects(formatted);
// 		} else {
// 			setSubjects(result.data);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchClasses();
// 	}, []);

// 	const fetchClass = async () => {
// 		const response = await fetch(
// 			`/api/institution/classes?class=${className.number}-${className.letter}`
// 		);
// 		const result = await response.json();
// 		if (!result.success) {
// 			console.error(result.data);
// 		}

// 		setClassObj(result.data);
// 	};

// 	useEffect(() => {
// 		fetchClass();
// 	}, [className.letter, className.number]);

// 	useEffect(() => {
// 		fetchSubjects();
// 	}, [classObj]);

// 	const handleOnChangeSubject = (value) => {
// 		setSubject(value);
// 	};

// 	return (
// 		<div className={styles.page}>
// 			<div className={styles.header}>
// 				<div>
// 					<label>Клас*</label>
// 					<div>
// 						<input
// 							className={standartStyles.inputRegular}
// 							defaultValue="1"
// 							type="number"
// 							min="1"
// 							max="11"
// 							placeholder="1"
// 							onChange={handleClassNumberChange}
// 						/>
// 						<select
// 							className={standartStyles.selectRegular}
// 							onChange={handleClassLetterChange}>
// 							{classLetters &&
// 								classLetters.map((el, index) => (
// 									<option
// 										key={index}
// 										value={el}>
// 										{el}
// 									</option>
// 								))}
// 						</select>
// 					</div>
// 				</div>
// 				<div>
// 					<label>Предмет*</label>
// 					<AutocompleteInput
// 						dataToSearch={subjects}
// 						onChange={handleOnChangeSubject}
// 						defaultValue={subject ? subject.name : ""}
// 					/>
// 				</div>
// 			</div>
// 			<table>
// 				<thead>
// 					<tr>
// 						<th>ПІБ учениці/учня</th>
// 						<th colSpan={'20'}>Дата та оцінки</th>
// 					</tr>
// 					<tr></tr>
// 				</thead>
// 				<tbody>
// 					<tr>
// 						<td></td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 						<td>01.01.</td>
// 					</tr>
// 					<tr>
// 						<td>Some child</td>
// 						<td>10</td>
// 						<td></td>
// 						<td>8</td>
// 						<td>10</td>
// 						<td></td>
// 						<td></td>
// 						<td></td>
// 						<td>6</td>
// 						<td>10</td>
// 						<td>10</td>
// 						<td>10</td>
// 						<td></td>
// 						<td>8</td>
// 						<td>10</td>
// 						<td></td>
// 						<td></td>
// 						<td></td>
// 						<td>6</td>
// 						<td>10</td>
// 						<td>10</td>
// 					</tr>
// 					<tr>
// 						<td>Some child</td>
// 						<td>10</td>
// 						<td></td>
// 						<td>8</td>
// 						<td>10</td>
// 						<td></td>
// 						<td></td>
// 						<td></td>
// 						<td>6</td>
// 						<td>10</td>
// 						<td>10</td>
// 						<td>10</td>
// 						<td></td>
// 						<td>8</td>
// 						<td>10</td>
// 						<td></td>
// 						<td></td>
// 						<td></td>
// 						<td>6</td>
// 						<td>10</td>
// 						<td>10</td>
// 					</tr>
// 					<tr>
// 						<td>Some child</td>
// 						<td>10</td>
// 						<td></td>
// 						<td>8</td>
// 						<td>10</td>
// 						<td></td>
// 						<td></td>
// 						<td></td>
// 						<td>6</td>
// 						<td>10</td>
// 						<td>10</td>
// 						<td>10</td>
// 						<td></td>
// 						<td>8</td>
// 						<td>10</td>
// 						<td></td>
// 						<td></td>
// 						<td></td>
// 						<td>6</td>
// 						<td>10</td>
// 						<td>10</td>
// 					</tr>
// 				</tbody>
// 			</table>
// 		</div>
// 	);
// }

"use client";

import standartStyles from "@/styles/Styles.module.scss";
import styles from "./AcademicRecords.module.scss";
import { useState, useEffect } from "react";
import AutocompleteInput from "../../UI/AutocompleteInput";

export default function AcademicRecords({ userRole }) {
	const [className, setClassName] = useState({ number: 1, letter: "А" });
	const [classLetters, setClassLetters] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [subject, setSubject] = useState({});
	const [classObj, setClassObj] = useState({});
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [year, setYear] = useState(new Date().getFullYear());

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
			console.log("formatted", formatted);
			setSubjects(formatted);
		} else {
			setSubjects(result.data);
		}
	};

	useEffect(() => {
		fetchClasses();
	}, []);

	const fetchClass = async () => {
		const response = await fetch(
			`/api/institution/classes?class=${className.number}-${className.letter}`
		);
		const result = await response.json();
		if (!result.success) {
			console.error(result.data);
		}

		setClassObj(result.data);
	};

	useEffect(() => {
		fetchClass();
	}, [className.letter, className.number]);

	useEffect(() => {
		fetchSubjects();
	}, [classObj]);

	const handleOnChangeSubject = (value) => {
		setSubject(value);
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

	const renderTableHeaders = () => {
		const daysInMonth = new Date(year, month, 0).getDate();
		const headers = [];
		headers.push(<th>ПІБ учениці/учня</th>);
		headers.push(<th colSpan={daysInMonth}>Дата</th>);
		return headers;
	};

	const renderTableCells = () => {
		const daysInMonth = new Date(year, month, 0).getDate();
		const rows = [];
		const dateCells = [];
		for (let i = 1; i <= daysInMonth; i++) {
			dateCells.push(
				<td key={i}>{`${i < 10 ? "0" + i : i}.${month}.`}</td>
			);
		}
		rows.push(
			<tr key={"datarow"}>
				<td key={"emptycell"}></td>
				{dateCells}
			</tr>
		);

		for (let i = 0; i < 20; i++) {
			const cells = [];
			cells.push(<td key={`pib${i}`}>ПІБ</td>);
			for (let j = 0; j < daysInMonth; j++) {
				cells.push(<td key={j}></td>);
			}
			rows.push(<tr key={`gradeRow${i}`}>{cells}</tr>);
		}

		return rows;
	};

	return (
		<div className={styles.page}>
			<div className={styles.header}>
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

				<div className={styles.tableContainer}>
					<div className={styles.tableHeaders}>
						<div><span>ПІБ учениці/учня</span></div>
						<div><span>Дата</span></div>
					</div>
					<table>
						<thead>
							<tr></tr>
							<tr>
							</tr>
						</thead>
						<tbody>
							{renderTableCells()}
						</tbody>
					</table>
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
