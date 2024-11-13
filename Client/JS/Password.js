document.getElementById('camera').addEventListener('click', () => {
      document.getElementById('fileInput').click();
    });
  

document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const fileInput = document.getElementById('fileInput');
    const Password = document.getElementById('password').value;
    

    if (fileInput.files.length === 0) {
        alert('Pls click on camera-icon and choose photo');
        return;
    }

    const formData = new FormData();
    formData.append('Profile', fileInput.files[0]);
    formData.append('Password', Password);
    
    console.log(formData);
    

    const response = await fetch('/api/register/proword', {
        method: 'POST',
        body: formData
    })
    if (response.ok) {
        console.log('Data sent successfully');
        window.location.href = '/chatHub';

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