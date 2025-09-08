export function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

export function formatEventTime(startsOnStr, endsOnStr) {
    const optionsDate = { month: '2-digit', day: '2-digit', year: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };

    const startsOn = new Date(startsOnStr);
    const endsOn = new Date(endsOnStr);

    // Format date (use start date)
    const dateFormatted = startsOn.toLocaleDateString(undefined, optionsDate);

    // Format times
    const startTimeFormatted = startsOn.toLocaleTimeString(undefined, optionsTime).toLowerCase();
    const endTimeFormatted = endsOn.toLocaleTimeString(undefined, optionsTime).toLowerCase();

    return `${dateFormatted} (${startTimeFormatted} - ${endTimeFormatted})`;
}

export function formatForGCal(dateStr) {
    // Parse date string to Date object
    const date = new Date(dateStr);
    // Format date parts with leading zeros
    const pad = n => n.toString().padStart(2, '0');

    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());

    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

export function createGCalendarLink(event, webURL) {
    const GCalendarBaseURL = 'https://calendar.google.com/calendar/u/0/r/eventedit?'
    const title = encodeURIComponent(event.name);
    const details = encodeURIComponent('For more details visit: ' + webURL)
    const date = encodeURIComponent(formatForGCal(event.starts_on) + '/' + formatForGCal(event.ends_on));
    const location = encodeURIComponent(event.location);

    return `${GCalendarBaseURL}text=${title}&dates=${date}&details=${details}&location=${location}`;
}