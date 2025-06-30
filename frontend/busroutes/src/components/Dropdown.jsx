import '../css/DropDown.css'

function DropDown({options,value,oppValue,setValue,placeholder}) {
    return (
        <select value={value} onChange = {e => setValue(e)} required>
            {placeholder && (
                <option value='' disabled>
                    {placeholder}
                </option>
            )}
            {options.map((loc) => (
                <option key={loc} value={loc}>
                    {loc}
                </option>
            ))}
        </select>
    )
    
}
export default DropDown