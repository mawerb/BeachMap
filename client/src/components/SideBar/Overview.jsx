function Overview({
    text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    styling = "text-gray-500 text-sm font-light m-2 line-clamp-15 md:line-clamp-20",
}) {
    return (
        <div className={styling}>
            <p className="whitespace-pre-line">{text}</p>
        </div>
    )
} export default Overview