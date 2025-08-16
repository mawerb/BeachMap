export const getOptions = async () => {
    try {
        const response = await fetch('https://csulbroutesserver.fly.dev/api/options/', { method: 'GET' });
        if (!response.ok) {
            throw new Error(`HTTPs error! status: ${response.status}`)
        };
        const data = await response.json();
        return data['options']
    } catch (err) {
        console.log('Fetch Error:', err)
    }
}

export const findOptRoute = async (start, end) => {
    try {
        const response = await fetch('https://csulbroutesserver.fly.dev/api/opt_path/',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ start, end })
            });
        if (!response.ok) {
            throw new Error(`HTTPs error! status: ${response.status}`)
        };
        const data = await response.json();
        return data['path']
    } catch (err) {
        console.log('Fetch Error:', err)
    }
}

export const getNodes = async () => {
    try {
        const response = await fetch('https://csulbroutesserver.fly.dev/api/nodes/', { method: 'GET' });
        if (!response.ok) {
            throw new Error(`HTTPs error! status: ${response.status}`)
        };
        const data = await response.json();
        return data['result']
    } catch (err) {
        console.log('Fetch Error:', err)
    }
}

export const updateNodes = async (
    nodes = {},
    deletedNodes = [],
    updatedNodes = [],
    renamedNodes = [],
) => {
    try {
        const response = await fetch('https://csulbroutesserver.fly.dev/api/update_nodes/', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                'nodes': nodes,
                'deleted_nodes': deletedNodes,
                'updated_nodes': updatedNodes,
                'renamed_nodes': renamedNodes,
            })
        });
        if (!response.ok) {
            throw new Error(`HTTPs error! status: ${response.status}`)
        };
        const data = await response.json();
        console.log(data)
    } catch (err) {
        console.log('Fetch Error:', err)
    }
}

export const uploadImage = async (image) => {
    try {
        const response = await fetch('https://csulbroutesserver.fly.dev/api/upload_image/', {
            method: "POST",
            body: image,
        })
        if (!response.ok) {
            throw new Error(`HTTPs error! status: ${response.status}`)
        }
        const data = await response.json();
        console.log('Image uploaded:', data);
        return data['image_url'];
    } catch (err) {
        console.log('Fetch Error:', err)
    }
};

export const getImage = async (imageName) => {
    try {
        if (!imageName) return null;
        imageName = encodeURIComponent(imageName);
        const response = await fetch(`https://csulbroutesserver.fly.dev/api/get_image/${imageName}/`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`HTTPs error! status: ${response.status}`)
        };
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        console.log('Image URL:', imageUrl);

        return imageUrl;
    } catch (err) {
        console.log('Fetch Error:', err)
    }
};

export const getEvents = async (nodeName, skip, take) => {
    try{
        const response = await fetch (`https://csulbroutesserver.fly.dev/api/events/${nodeName}/?skip=${skip}&take=${take}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`HTTPs error! status: ${response.status}`)
        };
        const data = await response.json();
        return data;
    } catch (err) {
        console.log('Fetch Error:', err)
    }
}

export const filterNodesByEvent = async () => {
    try{
        const response = await fetch('https://csulbroutesserver.fly.dev/api/events/get_nodes_with_events/')
        if (!response.ok) {
            throw new Error(`HTTPs error! status: ${response.status}`)
        };
        const data = await response.json();

        return data;
    } catch (err) {
        console.log('Fetch Error:', err);
        return [];
    }
}