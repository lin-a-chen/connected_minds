"use client";

import { useEffect, useState } from "react";
import styles from "./Classes.module.scss";
import { FaPlus, FaChalkboardTeacher } from "react-icons/fa";
import { toast } from "react-toastify";
import standartStyles from "@/styles/Styles.module.scss";
import { LuCross, LuTrash2 } from "react-icons/lu";
import AddClass from "@/components/modals/AddClass";

export default function InstitutionAdminClasses({ userRole }) {
	const [classes, setClasses] = useState([]);
	const [schoolchildren, setSchoolchildren] = useState({});
	const [expandedClasses, setExpandedClasses] = useState({});
	const [addClassModuleOpened, setAddClassModuleOpened] = useState(false);

	const fetchClassesAndChildren = async () => {
		const classesResponse = await fetch(`/api/institution/classes`);
		const classesResult = await classesResponse.json();
		if (!classesResult.success) {
			console.error(classesResult.data);
		}

		console.log('classes', classesResult.data)

		setClasses(classesResult.data);

		const schoolchildrenResponse = await fetch(
			`/api/institution/schoolchildren`
		);
		const schoolchildrenResult = await schoolchildrenResponse.json();
		if (!schoolchildrenResult.success) {
			console.error(schoolchildrenResult.data);
		}

		const childrenByClass = schoolchildrenResult.data.reduce(
			(acc, child) => {
				if (!acc[child.class_id]) {
					acc[child.class_id] = [];
				}
				acc[child.class_id].push(child);
				return acc;
			},
			{}
		);

		setSchoolchildren(childrenByClass);
	};

	useEffect(() => {
		fetchClassesAndChildren();
	}, []);

	const toggleExpandedClass = (classId) => {
		setExpandedClasses((prevState) => ({
			...prevState,
			[classId]: !prevState[classId],
		}));
	};

	const onDragStart = (e, classId, child) => {
		e.dataTransfer.setData("classId", classId);
		e.dataTransfer.setData("childId", child.id);
	};

	const onDrop = async (e, targetClassId) => {
		e.preventDefault();
		const childId = e.dataTransfer.getData("childId");

		const response = await fetch(`/api/institution/schoolchildren`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: childId, class_id: targetClassId }),
		});
		const result = await response.json();

		if (!result.success) {
			toast.error(result.data);
		}

		fetchClassesAndChildren();
	};

	const onDragOver = (e) => {
		e.preventDefault();
	};

	const handleAddClass = () => {
		setAddClassModuleOpened(true);
	};

	const handleOnCloseClassModule = () => {
		setAddClassModuleOpened(false);
		fetchClassesAndChildren();
	};

	const handleDelete = async (el) => {
		const response = await fetch(`/api/institution/classes?id=${el.id}`, {
			method: "DELETE",
		});
		const result = await response.json();
		if (!result.success) {
			toast.error(result.data);
			return;
		}
		toast.success("Клас видалено");
		fetchClassesAndChildren();
	};

	return (
		<div className={styles.classesPage}>
			{userRole === "INSTITUTION_ADMIN" && (
				<button
					onClick={handleAddClass}
					className={styles.addClassButton}>
					<LuCross />
					Додати клас
				</button>
			)}
			{userRole === "INSTITUTION_ADMIN" && addClassModuleOpened && (
				<AddClass
					isVisible={addClassModuleOpened}
					onClose={handleOnCloseClassModule}
				/>
			)}
			<div className={styles.classesContainer}>
				<div className={styles.column0}>
					{classes && classes.map(
						(el, index) =>
							index % 2 !== 0 && (
								<div
									key={el.id}
									className={`${styles.class}`}
									onDrop={(e) => onDrop(e, el.id)}
									onDragOver={(e) => onDragOver(e)}>
									<div className={styles.header}>
										<h3>{el.name}</h3>
										{userRole === "INSTITUTION_ADMIN" && (
											<button
												className={`${standartStyles.buttonDelete} ${standartStyles.buttonIconNoText}`}
												onClick={() =>
													handleDelete(el)
												}>
												<LuTrash2 />
											</button>
										)}
									</div>

									<div className={styles.teacherLine}>
										<FaChalkboardTeacher />
										<span>
											{console.log('el', el)}
											Класом керує:{" "}
											<a
												href={`/user/teacher/${el.teacher_id}`}>{`${el.lastname} ${el.firstname[0]}.${el.antroponym[0]}.`}</a>
										</span>
									</div>

									<p>Учні:</p>
									<div
										className={`${styles.members} ${
											expandedClasses[el.id]
												? styles.membersExpanded
												: ""
										}`}
										onClick={
											expandedClasses[el.id]
												? null
												: () =>
														toggleExpandedClass(
															el.id
														)
										}>
										<button
											className={styles.addMemberButton}>
											<FaPlus />
										</button>
										<div
											className={`${
												styles.membersCircles
											} ${
												expandedClasses[el.id]
													? styles.expanded
													: ""
											}`}>
											{schoolchildren[el.id]?.length >
											0 ? (
												schoolchildren[el.id]
													?.slice(
														0,
														expandedClasses[el.id]
															? schoolchildren[
																	el.id
															  ].length
															: 2
													)
													.map((child, index) => (
														<div
															key={index}
															className={`${
																styles.member
															} ${
																index > 1 &&
																!expandedClasses[
																	el.id
																]
																	? styles.hidden
																	: ""
															}`}
															draggable="true"
															onDragStart={(e) =>
																onDragStart(
																	e,
																	el.id,
																	child
																)
															}
															onClick={() =>
																(window.location.href = `/user/schoolchild/${child.id}`)
															}>
															<img
																src="/images/school-child.png"
																alt="Child"
															/>
															{expandedClasses[
																el.id
															] && (
																<span>
																	{
																		child.firstname
																	}{" "}
																	{
																		child.lastname
																	}
																</span>
															)}
														</div>
													))
											) : (
												<></>
											)}
										</div>
									</div>
									{expandedClasses[el.id] && (
										<button
											className={styles.hideButton}
											onClick={() =>
												toggleExpandedClass(el.id)
											}>
											Hide
										</button>
									)}
								</div>
							)
					)}
				</div>
				<div className={styles.column1}>
					{classes && classes.map(
						(el, index) =>
							index % 2 === 0 && (
								<div
									key={el.id}
									className={`${styles.class}`}
									onDrop={(e) => onDrop(e, el.id)}
									onDragOver={(e) => onDragOver(e)}>
									<div className={styles.header}>
										<h3>{el.name}</h3>
										{userRole === "INSTITUTION_ADMIN" && (
											<button
												className={`${standartStyles.buttonDelete} ${standartStyles.buttonIconNoText}`}
												onClick={() =>
													handleDelete(el)
												}>
												<LuTrash2 />
											</button>
										)}
									</div>

									<div className={styles.teacherLine}>
										<FaChalkboardTeacher />
										<span>
											Класом керує:{" "}
											<a
												href={`/user/teacher/${el.teacher_id}`}>{`${el.lastname} ${el.firstname[0]}.${el.antroponym[0]}.`}</a>
										</span>
									</div>

									<p>Учні:</p>
									<div
										className={`${styles.members} ${
											expandedClasses[el.id]
												? styles.membersExpanded
												: ""
										}`}
										onClick={() =>
											toggleExpandedClass(el.id)
										}>
										<button
											className={styles.addMemberButton}>
											<FaPlus />
										</button>
										<div
											className={`${
												styles.membersCircles
											} ${
												expandedClasses[el.id]
													? styles.expanded
													: ""
											}`}>
											{schoolchildren[el.id]?.length >
											0 ? (
												schoolchildren[el.id]
													?.slice(
														0,
														expandedClasses[el.id]
															? schoolchildren[
																	el.id
															  ].length
															: 2
													)
													.map((child, index) => (
														<div
															onClick={() =>
																(window.location.href = `/user/schoolchild/${child.id}`)
															}
															key={index}
															className={`${
																styles.member
															} ${
																index > 1 &&
																!expandedClasses[
																	el.id
																]
																	? styles.hidden
																	: ""
															}`}
															draggable="true"
															onDragStart={(e) =>
																onDragStart(
																	e,
																	el.id,
																	child
																)
															}>
															<img
																src={child.photo ? child.photo : '/images/school-child.png'}
																alt="Child"
															/>
															{expandedClasses[
																el.id
															] && (
																<span>
																	{
																		child.firstname
																	}{" "}
																	{
																		child.lastname
																	}
																</span>
															)}
														</div>
													))
											) : (
												<></>
											)}
										</div>
									</div>
									{expandedClasses[el.id] && (
										<button
											className={styles.hideButton}
											onClick={() =>
												toggleExpandedClass(el.id)
											}>
											Сховати
										</button>
									)}
								</div>
							)
					)}
				</div>
			</div>
		</div>
	);
}
