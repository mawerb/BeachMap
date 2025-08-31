import landmark from '../../assets/landmark.png'
import clock from '../../assets/clock.png'
import gcal_logo from '../../assets/gcal-logo.png'
import { Transition } from '@headlessui/react'
import { useState } from 'react';

function formatEventTime(startsOnStr, endsOnStr) {
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

function formatForGCal(dateStr) {
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

function createGCalendarLink(event, webURL) {
    const GCalendarBaseURL = 'https://calendar.google.com/calendar/u/0/r/eventedit?'
    const title = encodeURIComponent(event.name);
    const details = encodeURIComponent('For more details visit: ' + webURL)
    const date = encodeURIComponent(formatForGCal(event.starts_on) + '/' + formatForGCal(event.ends_on));
    const location = encodeURIComponent(event.location);

    return `${GCalendarBaseURL}text=${title}&dates=${date}&details=${details}&location=${location}`;
}

function EventsTab({
    events = ["No Events", "Poop", "stink", 'Freak', "hey!"],
}) {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const websiteURL = "https://csulb.campuslabs.com/engage/event/";

    if (events.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No events available</p>
            </div>
        )
    }

    return (
        events.map((event, index) => (
            < div key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
            >     <a target="_blank" rel="noopener noreferrer" href={websiteURL + event.id}>
                    <div
                        className="hover:bg-gray-100 flex p-2 items-center space-x-2 h-[10%] min-h-[70px]">
                        <img src={event.image_path} alt="Description" className="h-10 w-10 sm:h-8 sm:w-8 md:h-10 md:w-10 aspect-square object-cover rounded-full" />
                        <div className="flex-1">
                            <h1 className="text-sm font-bold truncate">{event.name}</h1>
                            <p className="text-xs text-gray-600 line-clamp-2">{event.description.replace(/<\/?[^>]+(>|$)/g, "") || "No description available"}
                            </p>
                        </div>
                    </div>
                </a>
                <Transition
                    show={hoveredIndex === index}
                    enter="transition-all duration-200 ease-out"
                    enterFrom="opacity-0 translate-y-2"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition-all duration-100 ease-in"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-2"
                >
                    <div className="bg-gray-200 flex flex-col min-w-full max-w-[275px] pl-2 pr-2 pt-1 pb-1">
                        <div className="flex gap-1 items-center max-w-[275px] ">
                            <img src={landmark} alt="Landmark" className="h-[20px] w-[20px] object-cover" />
                            <p className="text-xs text-gray-600 line-clamp-2">{event.location}</p>
                        </div>
                        <div className="flex gap-1 items-center max-w-[275px] ">
                            <img src={clock} alt="Landmark" className="m-[2.5px] h-[15px] w-[15px] object-cover" />
                            <p className="text-xs text-gray-600 line-clamp-2">
                                {formatEventTime(event.starts_on, event.ends_on)}
                            </p>
                            <a target="_blank" rel="noopener noreferrer" href={createGCalendarLink(event, websiteURL + event.id)}>
                                <img src={gcal_logo} alt="Google Calendar" className="h-[20px] w-[20px] ml-2" />
                            </a>

                        </div>
                    </div>

                </Transition>
            </div>
        ))
    )
} export default EventsTab