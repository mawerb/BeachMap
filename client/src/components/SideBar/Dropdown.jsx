import { useState, useEffect, useRef } from "react";
import waypoint from "../../assets/searchbox/waypoint-icon.svg"

const DropDown = ({ choices=['Oranges', 'Apples', 'Pearls','Feet'] }) => {
    const[value,setValue] = useState("");
    const[showSuggestions, setShowSuggestions] = useState(false);
    const suggestions = choices.filter( option => option.toLowerCase().includes(value.toLowerCase())).slice(0,4);

    const autocompleteRef = useRef();

    useEffect(() => {
        
    })

    const handleChange = event => {
        setValue(event.target.value)
    }

    const handleSuggestionClick = (suggestion) => {
        setValue(suggestion);
    }

    return (
        <div className="absolute top-10 left-8 z-[1100]">
            <div className="relative">
            <input 
                className={`text-black bg-white border border-[rgba(0,0,0,0.35)] 
                w-[17.7rem] h-[2.7rem] pl-4 focus:outline-none 
                focus:ring-0 placeholder:text-[rgba(0,0,0,0.5)] z-100 mt-4 text-lg
                ${showSuggestions && suggestions.length > 0 
                ? 'rounded-t-xl rounded-b-none' 
                : 'rounded-full'}`}
                value={value}
                onChange={handleChange}
                placeholder="Search Landmark"
                onFocus={() => {
                    setShowSuggestions(true)
                }}
                onBlur={() => {
                    setShowSuggestions(false)
                }}
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute top-full border-l border-r border-b border-[rgba(0,0,0,0.35)] 
                                rounded-b-xl w-[17.7rem] text-lg text-[rgba(0,0,0,0.75)] bg-white">
                    {suggestions.map(suggestion => (
                        <li className="flex gap-2 cursor-pointer items-center
                                       hover:bg-gray-200 pl-2 last:rounded-b-xl"
                        key={suggestion} 
                        onMouseDown={() => handleSuggestionClick(suggestion)}>
                            <img src={waypoint} className="w-[14.8px] h-[18px]"/>{suggestion}
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </div>
    )
}

export default DropDown