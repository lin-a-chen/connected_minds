import styles from "./NothingToShow.module.scss";

export default function NothingToShow({imageSource}){
    return (
        <div className={styles.container}>
            <div className={styles.image}>
                <img src={`/${imageSource}`}/>
            </div>
            <h3>Тут поки що 0 інформації, але незабаром користувачі щось додадуть!</h3>
        </div>
    );
}