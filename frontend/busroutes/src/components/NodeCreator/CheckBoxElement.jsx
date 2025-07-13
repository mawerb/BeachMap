function CheckBoxElement ({
    title = 'Enable Prop',
    onClick,
}) {
    return (
    <label className="flex items-center space-x-2 mb-1 font-montserrat">
        <input type="checkbox" className="form-checkbox" onClick={onClick}/>
        <span className="text-xs">{title}</span>
     </label>
    )
}

export default CheckBoxElement;