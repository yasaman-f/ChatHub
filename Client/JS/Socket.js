const socket = io("http://localhost:3001", { auth: { token: "token" } });

document.addEventListener('DOMContentLoaded', () => {
    socket.on('connect', () => {
        console.log('Connected to server');
        socket.emit('client connected');
        socket.emit('pastInfo');
    });

    socket.on('firstRes', (data) => {
        console.log('NamespaceResponse received:', data); 
        setNamespaceList(data);
    });
    
    
    socket.on('namespaceAdded', (newNamespace) => {  
        console.log('New namespace added:', newNamespace);
        addNamespaceToList(newNamespace);
    });
    
    socket.on('saveError', (error) => {
        alert("There was an error saving the namespace.");
    });
});

document.getElementById('submitNamespace').addEventListener('click', (event) => {
    event.preventDefault();
    const Namespace = document.getElementById('Namespace').value;
    const Description = document.getElementById('Description').value;
    
    const dataToSend = {
        action: 'POST',
        Namespace: Namespace,
        Description: Description,
        ConversationProfile: "path-to-image.png"
    };

    socket.emit('addNamespace', dataToSend);
});

function setNamespaceList(namespaces) {
    const namespacesElement = document.getElementById("NamespaceList");
    namespacesElement.innerHTML = ""; 
        namespaces.forEach(namespace => addNamespaceToList(namespace));        
}

function addNamespaceToList(namespace) {
    
    if (namespace.ConversationProfile) {
    const namespacesElement = document.getElementById("NamespaceList");

    const existingItem = Array.from(namespacesElement.children).find(item => item.querySelector(".namespaceTitle").innerText === namespace.Namespace);
    if (existingItem) return;

    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";

    const img = document.createElement("img");
    img.setAttribute("class", "namespaceImg");
    img.src = namespace.ConversationProfile || "default-image.png"; 
    console.log("image's src is:", img.src);
    
    img.style.width = "30px"; 
    img.style.height = "30px";
    img.style.marginRight = "10px";

    img.onload = function() {
        console.log("image upload succesfull");
    };
    img.onerror = function() {
        console.log("image upload failed");
        img.src = "default-image.png";
    };

    const p = document.createElement("p");
    p.setAttribute("class", "namespaceTitle");
    p.innerText = namespace.Namespace;

    li.appendChild(img);
    li.appendChild(p);
    namespacesElement.appendChild(li);

    console.log("the updated list of namespace:", namespacesElement);
    }
    updateListPosition();
}


function updateListPosition() {
    const namespacesElement = document.getElementById("NamespaceList");
    const itemCount = namespacesElement.children.length;
    
    const baseTop = 22; 
    const additionalTopPerItem = 3.5; 
    const newTop = baseTop + ((itemCount - 1) * additionalTopPerItem);
    namespacesElement.style.top = `${newTop}%`;
    console.log(namespacesElement.querySelector("img").src)
    
}

