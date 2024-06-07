import {v4 as uuidv4} from "uuid";

export const getLocalDatetime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localTime = new Date(now.getTime() - offset);
    return localTime.toISOString().slice(0, 19).replace('T', ' ');
};

export const formatDateToMySQL = (date) => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

export const generateUUID = () => {
    return uuidv4();
}