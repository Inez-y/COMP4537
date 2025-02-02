import messages from "../lang/messages/en/user.js";

class Reader {
    constructor() {
        this.body = document.getElementById("main-content");
        
        this.display();
        this.auto_update();
    }

    formatMessage(template, values = {}) {
        // Use the replace method to find all placeholders in the template and replace them.
        // The placeholders are enclosed in curly braces (e.g., {key}).
        return template.replace(
            /\{(\w+)\}/g, // This regular expression finds placeholders like {key}.
            (_, key) => {
                // "_" captures the full placeholder (e.g., {key}).
                // "key" captures the word inside the curly braces (e.g., "key").
                
                // Replace the placeholder with the corresponding value from the "values" object.
                // If the "values" object doesn't have the key, leave the placeholder unchanged.
                return values[key] || `{${key}}`;
            }
        );
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

    auto_update() {
        console.log("Auto update initialized");
        setInterval(() => this.track_change(), 2000);
    }
    
    track_change() {
        window.addEventListener("storage", (event) => {
            if (event.storageArea === localStorage) {
                console.log("Change detected in localStorage");
                const clock = document.getElementById("clock");
                clock.textContent = this.time();
                this.display();
            }
        });
    }
    
    display() {
        console.log("Displaying messages");
    
        if (localStorage.length === 0) {
            console.log(messages.msg_notSupported); 
            return;
        }
    
        this.body.innerHTML = ""; 
    
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i); // date
            const value = localStorage.getItem(key); // message
    
            const messageDiv = document.createElement("div");
            messageDiv.className = "message";
            messageDiv.textContent = `${value}`;
    
            this.body.appendChild(messageDiv);
        }
    }
}

// Automatically ready when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    new Reader();
});