import { useState, useEffect, useRef } from "react";
import waypoint from "../assets/searchbox/waypoint-icon.svg"

const DropDown = ({ options=['Oranges', 'Apples', 'Pearls','Feet'] }) => {
    const[value,setValue] = useState("");
    const[showSuggestions, setShowSuggestions] = useState(false);
    const suggestions = options.filter( option => option.toLowerCase().includes(value.toLowerCase())).slice(0,4);

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
        <div className="flex w-[20rem] z-50 items-center flex-col">
            <input 
                className={`text-black bg-white border border-[rgba(0,0,0,0.35)] 
                w-[17.7rem] h-[2.7rem] pl-4 focus:outline-none 
                focus:ring-0 placeholder:text-[rgba(0,0,0,0.5)] z-10 mt-4 text-lg
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
                <ul className="border-l border-r border-b border-[rgba(0,0,0,0.35)] 
                               rounded-b-xl w-[17.7rem] text-lg text-[rgba(0,0,0,0.75)]">
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
    )
}

export default DropDown