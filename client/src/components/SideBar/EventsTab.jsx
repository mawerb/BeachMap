import placeholder from '../../assets/InfoBar/placeholder-event.png'

function EventsTab({
    events=["No Events", "Poop","stink",'Freak',"hey!"],
}) {
    return(
        events.map((event,index) => (
            <div key={index} className="flex items-center space-x-2 h-[10%] min-h-[70px]">
                <img src={placeholder} alt="Description" className="h-[75%] aspect-square object-cover rounded-full" />
                <div className="flex-1">
                    <h1 className="text-sm font-bold">Title here</h1>
                    <p className="text-xs text-gray-600">Some descriptive text on the right side.
                        This is a placeholder for the event description.
                    </p>
                </div>
                            </div>
        ))
    )
} export default EventsTab