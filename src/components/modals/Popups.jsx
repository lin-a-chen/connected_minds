import styles from "./Popups.module.scss";
import { IoIosClose } from "react-icons/io";

export const InfoPopup = ({ pictureSource, heading, text, linkForButtonOkay, actionForButtonOkay }) => {

    return(
        <div className={styles.popupBackdrop}>
            <div className={`${styles.popupWindow} ${styles.infoPopup}`}>
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

export const ErrorPopup = ({ pictureSource, heading, text, actionForButtonOkay }) => {

    return(
        <div className={styles.popupBackdrop}>
            <div className={`${styles.popupWindow} ${styles.errorPopup}`}>
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
                    <button onClick={actionForButtonOkay} className={styles.approve}>Добре</button>
                    <a href={'/'} className={styles.cancel}>Відхилити</a>
                </div>
            </div>
        </div>
        
    );
}