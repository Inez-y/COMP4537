import messages from "../lang/messages/en/user.js";

class Writer {
    constructor() {
        this.tuple = "{}"; // key-storedate, value-msg
        this.json = JSON.parse(this.tuple);

        this.add_btn = document.getElementById("add-button");
        this.add_btn.addEventListener("click", () => this.add());
        this.msg = document.getElementById("msg");

        this.body = document.getElementById("main-content");
        this.content = document.createElement("div");
        this.each_content = document.createElement("p");

        // display message
        this.display();
        this.auto_save();
    }

    time() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const date = now.toDateString();

        // 00:00:00 format - padStart(2 digits, fill with 0)
        const formattedTime = `${date}, ${hours}:${minutes}:${seconds}`;
        console.log(`Current Time: ${formattedTime}`);

        return formattedTime;
    }

    add() {
        console.log("Clicked a add button")


        if (typeof (Storage) == "undefined") {
            const msgDisplay = new MessageDisplay();
            console.error("Not supported localStorage");
            msgDisplay.displayMessage(messages.msg_notSupported);
        } 

        const inputValue = this.msg.value.trim();
        // setting local storage item
        localStorage.setItem(this.time(), inputValue);
        // document.write(messages.msg_written + this.msg);
        console.log("Current local storage length: " + localStorage.length);

        this.display();
    }

    modify() {

    }

    auto_save() {
        console.log("Auto save triggered");
    
        let lastSavedValue = ""; 
        const autoSaveKey = "autoSave"; // Key used for auto-saving in localStorage
    
        // Auto-save logic
        setInterval(() => {
            const currentValue = this.msg.value.trim(); 
            if (currentValue && currentValue !== lastSavedValue) {
                console.log("Auto-saving:", currentValue);
                localStorage.setItem(autoSaveKey, currentValue);
                lastSavedValue = currentValue; 
                document.getElementById("clock").textContent = this.time();
            }
        }, 2000);
    
        // Update the display every 2 seconds
        setInterval(() => this.display(), 2000);

    }
    
    
    

    display() {
        console.log("Displaying messages");

        this.body.innerHTML = "";

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i); 
            const value = localStorage.getItem(key);
            // console.log(`${key}: ${value}`);
            this.body.appendChild(this.content);

            const messageDiv = document.createElement("div");
            const delDiv = document.createElement("button");
            messageDiv.className = "message"; // Add CSS class for styling
            messageDiv.textContent = `${value}`; // Display key and value

            delDiv.id = `remove-id-${key}`;
            delDiv.textContent = "Remove";
            delDiv.className = "remove-button";
            delDiv.addEventListener("click", () => this.remove(key));

            // Append to the main content area
            this.body.appendChild(messageDiv);
            this.body.appendChild(delDiv);
        }        
    }

    remove(key) {
        console.log(`Clicked a remove button with id: ${key}`);
        localStorage.removeItem(key);
        console.log(`Length of localStorage is: ${localStorage.length}`);
        this.display();
    }
}

// Game is automatically ready when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    new Writer();
});