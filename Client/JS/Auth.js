document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const data = {};
        document.querySelectorAll('.input-1 input').forEach(ele => {
            data[ele.id] = ele.value;
        });        
        const response = await fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('Data sent successfully');
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        alert(`Error: ${errorData.message}`);
    }
});
