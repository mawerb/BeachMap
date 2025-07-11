import Spinner from './Spinner'

export default function Button({
    loading,
    onClick,
    title='submit',
    disabled = false,
}) {
    return (
        <button
        className='flex transform flex-row items-center 
        justify-center rounded-mg bg-blue-600 px-2 py-1
        text-white shadow-lg outline-none transition-transform
        focus:ring-2 active:scale-95'
        onClick={onClick} 
        disabled={loading || disabled}
        >
            {loading && <Spinner className='mr-2'/>}
            {title}
        </button>
    )
}