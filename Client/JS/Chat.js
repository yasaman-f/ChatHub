document.getElementById('svg-plus').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popupForm').style.display = 'block';
});

document.getElementById("friendsHeader").addEventListener("click", () => {
    var list = document.getElementById("friendsList");
    var List = document.getElementById("NamespaceList");
    if (List.children.length === 0) { 
        console.log("i can't find anything");
        if (list.style.display === "none") {
            list.style.display = "block";
        } else {
            list.style.display = "none";
        } 
    }else {
        if (list.style.display === "none" && List.style.display === "none") {
            console.log("i found sth");
                list.style.display = "block";
                List.style.display = "block";
            } else {
                list.style.display = "none";
                List.style.display = "none";
            }
    }
});

document.getElementById("add-room").addEventListener("click", () => {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popupFormNamespace').style.display = 'block';
});


document.getElementById('camera').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('submitNamespace').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const fileInput = document.getElementById('fileInput');

        if (fileInput.files.length === 0) {
            alert('Pls click on camera-icon and choose photo');
            return;
        }

        const formData = new FormData();
        formData.append('ConversationProfile', fileInput.files[0]);  

        setTimeout(async () => {
            try {
                const response = await fetch('/api/chatHub/AddImage', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    console.log('Data sent successfully');
                    alert('Namespace created successfully!');
                    document.getElementById('popupFormNamespace').style.display = "none";
                    document.getElementById('overlay').style.display = 'none';
                    document.getElementById('Namespace').value = ""
                    document.getElementById('Description').value = ""
                    document.getElementById("friendsList").style.display = "none";
                    document.getElementById("NamespaceList").style.display = "none";

                } else {
                    
                    const errorData = await response.json();
                    console.error('Error:', errorData.message);
                    alert(`Error: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error:', error.message);
                alert(`Error: ${error.message}`);
            }


        }, 1000);

    } catch (error) {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
    }
});




