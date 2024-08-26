document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        let data = {};
        document.querySelectorAll('.form-control').forEach(ele => {
            data = {'OTP': ele.value}
        });        
        console.log(data);
        const response = await fetch('/api/register/otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
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
