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
        return data['path']
    } catch (err) {
        console.log('Fetch Error:', err)
    }
}

export const getNodes = async () => {
    try{
        const response = await fetch('http://localhost:8000/api/nodes/', {method:'GET'});
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        };
        const data = await response.json();
        return data['result']
    } catch (err) {
        console.log('Fetch Error:', err)
    }
}

export const updateNodes = async( nodes ) => {
    try{
        const response = await fetch('http://localhost:8000/api/update_nodes/', {
            method:"PUT",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify( nodes )
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        };
        const data = await response.json();
        console.log(data)
    } catch (err) {
        console.log('Fetch Error:', err)
    }
}