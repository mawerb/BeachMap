function LoaderSimple({ 
    text,
    style,
    useAbsolute = false
}) {

    const baseClasses = useAbsolute 
    ? "absolute inset-0 flex items-center justify-center z-[2000] bg-gray-100"
    : "fixed flex items-center justify-center z-[2000] h-screen w-screen bg-gray-100";

    return (
        <div className={`${baseClasses} ${style || ''}`}>
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 border-solid mb-4"></div>
                <p className="text-lg font-semibold text-gray-700 animate-pulse">{text}</p>
            </div>
        </div>
    )
} export default LoaderSimple