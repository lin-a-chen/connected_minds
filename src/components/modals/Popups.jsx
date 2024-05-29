import styles from "./Popups.module.scss";
import { IoIosClose } from "react-icons/io";

export const InfoPopup = ({ pictureSource, heading, text, linkForButtonOkay }) => {

    return(
        <div className={styles.popupBackdrop}>
            <div className={styles.popupWindow}>
                {/* <div className={styles.cross}>
                    <IoIosClose/>
                </div> */}
                <div className={styles.header}>
                    <div className={styles.picture}>
                        <img src={pictureSource} />
                    </div>
                    <div className={styles.headingContent}>
                        <h4 className={styles.heading}>
                            {heading}
                        </h4>
                        <p className={styles.text}>
                            {text}
                        </p>
                    </div>
                </div>
                
                <div className={styles.buttons}>
                    <a href={linkForButtonOkay} className={styles.approve}>Добре</a>
                </div>
            </div>
        </div>
        
    );
}