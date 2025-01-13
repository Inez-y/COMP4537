import messages from "../lang/messages/en/user.js";

class InitializeGame {
    constructor() {
        this.userInputStr = document.getElementById("user-input");
        this.startButton = document.getElementById("go-button");
        this.startButton.addEventListener("click", () => this.prepareGame());
    }

    prepareGame() {
        console.log("User clicked the GO button. Preparing the game...");
        const userInputInt = parseInt(this.userInputStr.value);

        if (isNaN(userInputInt) || userInputInt < 3 || userInputInt > 7) {
            const msgDisplay = new MessageDisplay();
            msgDisplay.displayMessage("invalidInput");
            return;
        }

        new StartGame(userInputInt);
    }
}

class StartGame {
    constructor(userInput) {
        this.numOfBox = userInput;
        this.boxOrder = new Map();
        this.userBoxOrder = new Map();
        this.theContent = document.getElementById("main-content");
        this.boxBlock = document.createElement("div");
        this.boxBlock.className = "box-content";

        this.makeBoxes();
    }

    makeBoxes() {
        console.log("Making boxes...");
        if (!this.theContent) {
            console.error("No element with id 'main-content' found.");
            return;
        }

        this.theContent.innerHTML = ""; // Clear previous game content
        this.theContent.appendChild(this.boxBlock);
        this.randomBox();

        setTimeout(() => {
            this.shuffleBoxes();
        }, this.numOfBox * 1000);
    }

    randomBox() {
        for (let i = 1; i <= this.numOfBox; i++) {
            const boxColour = this.getRandomColour();
            const eachBox = document.createElement("button");
            eachBox.className = "box-button";
            eachBox.style.backgroundColor = boxColour;
            eachBox.textContent = i; // Display number
            this.boxOrder.set(i, boxColour);
            this.boxBlock.appendChild(eachBox);
        }

        console.log("Box Order:", [...this.boxOrder.entries()]);
    }

    getRandomColour() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    shuffleBoxes() {
        console.log("Shuffling boxes...");
        const buttons = Array.from(this.boxBlock.querySelectorAll(".box-button"));
        let moves = 0;

        const shuffleInterval = setInterval(() => {
            buttons.forEach(button => {
                const maxX = window.innerWidth - button.offsetWidth;
                const maxY = window.innerHeight - button.offsetHeight;

                button.style.position = "absolute";
                button.style.top = `${Math.random() * maxY}px`;
                button.style.left = `${Math.random() * maxX}px`;
            });

            moves++;
            if (moves === this.numOfBox) {
                clearInterval(shuffleInterval);
                this.hideNumbersAndStartGame(buttons);
            }
        }, 2000);
    }

    hideNumbersAndStartGame(buttons) {
        console.log("Hiding numbers and starting the game...");
        buttons.forEach(button => {
            button.textContent = ""; // Hide the numbers
            button.addEventListener("click", (e) => this.userMemoryTest(e));
        });
    }

    userMemoryTest(event) {
        console.log("User memory test begins!");
        const button = event.target;
        const clickedColor = this.normalizeColor(button.style.backgroundColor);
        const expectedColor = this.normalizeColor(this.boxOrder.get(this.userBoxOrder.size + 1));
    
        // Check if the clicked color matches the expected color
        if (clickedColor === expectedColor) {
            this.userBoxOrder.set(this.userBoxOrder.size + 1, clickedColor);
            button.textContent = this.userBoxOrder.size; // Reveal number
    
            // Check if the user has completed the game
            if (this.userBoxOrder.size === this.boxOrder.size) {
                const msgDisplay = new MessageDisplay();
                msgDisplay.displayMessage("excellentMemory");
            }
        } else {
            // If the user clicks the wrong order
            const msgDisplay = new MessageDisplay();
            msgDisplay.displayMessage("wrongOrder");
            this.revealCorrectOrder();
        }
    }
    
    normalizeColor(color) {
        // Converts colors to a consistent format (e.g., hex)
        const tempDiv = document.createElement("div");
        tempDiv.style.color = color;
        document.body.appendChild(tempDiv);
        const normalizedColor = window.getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);
        return normalizedColor;
    }

    
    revealCorrectOrder() {
        console.log("Revealing correct order...");
        const buttons = Array.from(this.boxBlock.querySelectorAll(".box-button"));
        buttons.forEach((button, index) => {
            button.textContent = index + 1;
        });
    }
}

// File: js/MessageDisplay.js
class MessageDisplay {
    constructor() {
        this.messages = messages; // Inject messages from user.js
    }

    displayMessage(msgKey, additionalInfo = "") {
        const message = this.messages[msgKey] || "Unknown message key!";
        const finalMessage = message + additionalInfo;

        const msgBlock = document.createElement("p");
        msgBlock.textContent = finalMessage;

        const element = document.getElementById("form");
        if (!element) return;

        element.appendChild(msgBlock);

        setTimeout(() => {
            element.removeChild(msgBlock);
        }, 2000); // Message disappears after 2 seconds
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new InitializeGame();
});