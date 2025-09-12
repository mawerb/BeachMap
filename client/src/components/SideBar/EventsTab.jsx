import landmark from '../../assets/landmark.png'
import clock from '../../assets/clock.png'
import gcal_logo from '../../assets/gcal-logo.png'
import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react';
import { isTouchDevice, formatEventTime, formatForGCal, createGCalendarLink } from '../../services/utility';

function EventsTab({
    events = ["No Events", "Poop", "stink", 'Freak', "hey!"],
}) {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [clickCount, setClickCount] = useState(0);
    const [focusedEvent, setFocusedEvent] = useState(null);
    const websiteURL = "https://csulb.campuslabs.com/engage/event/";
    const isTouch = isTouchDevice();

    useEffect(() => {
        let timer;
        if (clickCount > 0) {
            timer = setTimeout(() => {
                setClickCount(0)
                setFocusedEvent(null);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [clickCount]);

    const handleClick = (eventId) => {
        const url = websiteURL + eventId;

        // Handle non-touch device click, open link immediately
        if (!isTouch) {
            window.open(url, "_blank", "noopener,noreferrer");
            return;
        }

        // Reset click count if clicking on a different event
        if (focusedEvent !== eventId) {
            setClickCount(1);
            setFocusedEvent(eventId);
            return;
        }

        // Handle touch device click, require double tap to open link
        if (clickCount === 0) {
            setClickCount(1);
        } else {
            window.open(url, "_blank", "noopener,noreferrer");
            setClickCount(0);
            setFocusedEvent(null);
        }
    }

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
            >
                <div
                    onClick={() => handleClick(event.id)}
                    className={`hover:bg-gray-100 flex p-2 items-center space-x-2 h-[10%] min-h-[70px] 
                                ${isTouch && focusedEvent === event.id ? "bg-yellow-100 bg-gray-100 cursor-pointer" : ""}`}>
                    <img src={event.image_path} alt="Description" className="h-10 w-10 sm:h-8 sm:w-8 md:h-10 md:w-10 aspect-square object-cover rounded-full" />
                    <div className="flex-1 min-w-0">
                        <h1 className="text-sm font-bold truncate">{event.name}</h1>
                        <p className="text-xs text-gray-600 line-clamp-2 break-all">{event.description.replace(/<\/?[^>]+(>|$)/g, "") || "No description available"}
                        </p>
                    </div>
                </div>
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