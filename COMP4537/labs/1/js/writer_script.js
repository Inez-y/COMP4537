import messages from "../lang/messages/en/user.js";

class Writer {
    constructor() {
        this.body = document.getElementById("main-content");
        this.lastSavedValues = {}; 
        this.temporaryValues = {}; 
        this.modifiedFields = {};
        this.display(); 
        this.auto_save(); 
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
        return `${date}, ${hours}:${minutes}:${seconds}`;
    }

    writing_time() {
        const clock = document.getElementById("clock");
        if (clock) {
            clock.innerHTML = this.time();
        }
    }

    generate_input_box() {
        console.log("Generating an input box...");

        const content = document.createElement("div");
        content.className = "input-box";

        const newUserInput = document.createElement("input");
        newUserInput.type = "text";
        const ids = Math.floor(Math.random() * 1000); 
        newUserInput.id = `input-box-${ids}`;
        newUserInput.placeholder = "Enter your text here";

        const new_add_btn = document.createElement("button");
        new_add_btn.textContent = "Add";
        new_add_btn.id = `add-btn-${ids}`;

        content.appendChild(newUserInput);
        content.appendChild(new_add_btn);
        this.body.appendChild(content);

        new_add_btn.addEventListener("click", () => this.save(ids));
        newUserInput.addEventListener("input", () => {
            this.temporaryValues[ids] = newUserInput.value; // Temporarily save the input
            this.modifiedFields[ids] = true; // Mark as modified
        });
    }

    save(ids) {
        const inputElement = document.getElementById(`input-box-${ids}`);

        const value = inputElement.value.trim();
        const key = `${ids}`;

        console.log(this.formatMessage(messages.msg_written, { key }));


        if (value === "") {
            console.warn(this.formatMessage(messages.msg_error, { error: "Input field is empty" }));
            // still saved
            return;
        }

        localStorage.setItem(key, value); 
        this.lastSavedValues[key] = value; // Update the last saved value
        console.log(`Saved as key: ${key}, value: ${value}`);
        this.modifiedFields[ids] = false; // Mark as not modified
        this.display();
    }

    auto_save() {
        console.log("Auto save started");

        setInterval(() => {
            Object.keys(this.modifiedFields).forEach((key) => {
                if (this.modifiedFields[key]) {
                    // Save only if the field is modified
                    console.log(`Autosaving modified field: ${key}`);
                    const value = this.temporaryValues[key]; // Get the latest value
                    if (value !== undefined) {
                        localStorage.setItem(key, value); 
                        this.lastSavedValues[key] = value; 
                        this.modifiedFields[key] = false; // Mark as not modified
                        console.log(`Autosaved: ${key} -> ${value}`);
                        this.writing_time();
                    }
                }
            });
        }, 2000);
    }

    remove(key) {
        localStorage.removeItem(key);
        delete this.lastSavedValues[key];
        delete this.temporaryValues[key]; 
        delete this.modifiedFields[key]; 
        console.log(this.formatMessage(messages.msg_removed, { key }));
        this.display(); // Refresh the display
    }

    modify(key) {
        const inputElement = document.getElementById(`input-box-${key}`);
        if (!inputElement) {
            console.log(this.formatMessage(messages.msg_error, { error: "Input element not found" }));
            return;
        }

        const newValue = inputElement.value.trim();
        if (newValue === "") {
            console.log(this.formatMessage(messages.msg_error, { error: "Cannot save an empty value" }));
            return;
        }

        localStorage.setItem(key, newValue); 
        this.lastSavedValues[key] = newValue; // Update last saved values
        console.log(this.formatMessage(messages.msg_modified, { key, value: newValue }));
    }

    display() {
        console.log("Displaying messages");

        this.body.innerHTML = ""; 
        this.generate_input_box(); 

        for (let i = 0; i < localStorage.length; i++) {
            const id_num = localStorage.key(i); // Get key
            const message = localStorage.getItem(id_num); // Get value

            // Create container for the input and buttons
            const new_div = document.createElement("div");
            new_div.id = `${id_num}`;
            new_div.className = "stored-item";

            // Create the input box for editing
            const input_box = document.createElement("input");
            input_box.id = `input-box-${id_num}`;
            input_box.type = "text";
            input_box.value = message;

            // Track the last saved value for this input
            this.lastSavedValues[id_num] = message;
            this.temporaryValues[id_num] = message; // Initialize temporary value
            this.modifiedFields[id_num] = false; // Initially not modified

            // Detect user modifications
            input_box.addEventListener("input", () => {
                this.temporaryValues[id_num] = input_box.value; // Temporarily save the input
                this.modifiedFields[id_num] = true; // Mark as modified
            });

            // Create the edit button
            const edit_btn = document.createElement("button");
            edit_btn.textContent = "Edit";
            edit_btn.addEventListener("click", () => this.modify(id_num));

            // Create delete button
            const del_btn = document.createElement("button");
            del_btn.textContent = "Delete";
            del_btn.addEventListener("click", () => this.remove(id_num));

            // Append elements to the container
            new_div.appendChild(input_box);
            new_div.appendChild(edit_btn);
            new_div.appendChild(del_btn);

            // Append the container to the body
            this.body.appendChild(new_div);
        }
    }

    displayMessage(message) {
        // Create a message element
        const messageElement = document.createElement("div");
        messageElement.className = "notification"; // Add a class for styling
        messageElement.textContent = message;
    
        // Append the message to the body or a specific container
        const messageContainer = document.getElementById("message-container");
        if (messageContainer) {
            messageContainer.appendChild(messageElement);
        } else {
            document.body.appendChild(messageElement); // Fallback if no container
        }
    
        // Optionally remove the message after a delay
        setTimeout(() => {
            messageElement.remove();
        }, 3000); // Message will disappear after 3 seconds
    }
    
}


// Automatically ready when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    new Writer();
});
