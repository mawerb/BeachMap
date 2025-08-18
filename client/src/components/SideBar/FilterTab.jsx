import filterIcon from '../../assets/filter.png'
import { useState } from 'react'

function FilterTab() {
    const[hovered, setHovered] = useState(false)

    const handleMouseEnter = () => setHovered(true)
    const handleMouseLeave = () => setHovered(false)

    return (
        <div 
        className="absolute z-[1100] top-14 left-90 bg-white border border-gray-200 rounded-md shadow-md p-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!hovered ? (
          <img src={filterIcon} className="h-6 w-6" alt="Filter" />
        ) : (
          <div className="p-2 min-w-[120px]">
            <p className="text-sm font-medium">Filter Options</p>
            <button className="w-full text-left text-xs mt-1 hover:bg-gray-100 p-1 rounded">
              By Date
            </button>
            <button className="w-full text-left text-xs mt-1 hover:bg-gray-100 p-1 rounded">
              By Type
            </button>
          </div>
        )}
      </div>
    )
} export default FilterTab