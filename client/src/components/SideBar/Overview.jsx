function Overview({
    overview,
    styling = "text-gray-500 text-sm font-light m-2 line-clamp-15 md:line-clamp-20",
}) {

    if (!overview) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No overview available</p>
            </div>
        )
    }

    return (
        <div className={styling}>
            <p className="whitespace-pre-line">{overview}</p>
        </div>
    )
} export default Overview