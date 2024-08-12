import {format, formatDistanceToNow} from "date-fns";

export function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd MMM');
}

export function formatTime(timeString) {
    if (!timeString) return '';
    const [hour, minute] = timeString.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    return format(date, 'HH:mm');
}

export function timeSince(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const distance = formatDistanceToNow(date, {addSuffix: true});
    return distance;
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export function parseEventDateTime(isoDateString, timeString) {
    const datePart = isoDateString.split('T')[0]; // Extract the date part
    const [year, month, day] = datePart.split('-').map(Number);

    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    const parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);

    return parsedDate;
}