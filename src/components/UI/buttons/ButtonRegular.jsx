'use client'
import commonStyles from "../../../styles/Styles.module.scss";

const ButtonRegular = ({ label, type, onClick }) => {

  return (
    <button type={type} className={commonStyles.buttonRegular} onClick={onClick}>
      {label}
    </button>
  );
};

export default ButtonRegular;
