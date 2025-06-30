export const getOptions = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/options/', {method:'GET'});
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        };
        const data = await response.json();
        return data['options']
    } catch (err) {
        console.log('Fetch Error:', err)
    }
}

export const findOptRoute = async(start,end) => {
    try {
        const response = await fetch('http://localhost:8000/api/opt_path/', 
            {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ start, end })
            });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        };
        const data = await response.json();
        console.log(data)
        return data['path']
    } catch (err) {
        console.log('Fetch Error:', err)
    }
}