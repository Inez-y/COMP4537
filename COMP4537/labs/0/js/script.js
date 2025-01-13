/**
 * The docstring format was provided by ChatGPT
 */
import messages from "../lang/messages/en/user.js";

/**
 * @class InitializeGame
 * @description Handles the initialization of the memory game. Sets up event listeners for user input 
 * and validates the input to start the game.
 */
class InitializeGame {
    /**
     * @constructor
     * Initializes the game by attaching event listeners and preparing input elements.
     */
    constructor() {
        this.userInputStr = document.getElementById("user-input");
        this.startButton = document.getElementById("go-button");
        this.startButton.addEventListener("click", () => this.prepareGame());
    }

    /**
     * @method prepareGame
     * Validates user input and starts the game if valid; displays error messages for invalid input.
     */
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

/**
 * @class StartGame
 * @description Handles the core functionality of the memory game, including creating buttons, shuffling,
 * hiding numbers, and evaluating user input.
 */
class StartGame {
    /**
     * @constructor
     * Initializes the game with the number of boxes specified by the user.
     * @param {number} userInput - The number of boxes to create.
     */
    constructor(userInput) {
        this.numOfBox = userInput;
        this.boxOrder = new Map();
        this.userBoxOrder = new Map();
        this.theContent = document.getElementById("main-content");
        this.boxBlock = document.createElement("div");
        this.boxBlock.className = "box-content";

        // Calling a method to initiate
        this.makeBoxes();
    }

    /**
     * @method makeBoxes
     * Creates the buttons for the memory game and prepares the shuffling sequence.
     */
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

    /**
     * @method randomBox
     * Creates buttons with random colors and numbers, stores their order in a map.
     */
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

    /**
     * @method getRandomColour
     * Generates a random hexadecimal color.
     * @returns {string} A random hex color string.
     */
    getRandomColour() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    /**
     * @method shuffleBoxes
     * Shuffles the buttons randomly on the screen, ensuring they do not overlap the form.
     */
    shuffleBoxes() {
        console.log("Shuffling boxes...");
        const buttons = Array.from(this.boxBlock.querySelectorAll(".box-button"));
        const formHeight = document.getElementById("form").offsetHeight; // Get form height
        const formBottom = document.getElementById("form").getBoundingClientRect().bottom; // Bottom position of the form
        let moves = 0;
    
        const shuffleInterval = setInterval(() => {
            buttons.forEach(button => {
                const maxX = window.innerWidth - button.offsetWidth;
                const maxY = window.innerHeight - formBottom - button.offsetHeight; // Exclude form space
    
                button.style.position = "absolute";
                button.style.top = `${Math.random() * maxY + formBottom}px`; // Ensure position starts below the form
                button.style.left = `${Math.random() * maxX}px`; // Ensure position is within window width
            });
    
            moves++;
            if (moves === this.numOfBox) {
                clearInterval(shuffleInterval);
                this.hideNumbersAndStartGame(buttons);
            }
        }, 2000);
    }
    
    /**
     * @method hideNumbersAndStartGame
     * Hides the numbers on the buttons and attaches event listeners for user interaction.
     * @param {HTMLElement[]} buttons - List of buttons to hide numbers and prepare for user clicks.
     */
    hideNumbersAndStartGame(buttons) {
        console.log("Hiding numbers and starting the game...");
        buttons.forEach(button => {
            button.textContent = ""; // Hide the numbers
            button.addEventListener("click", (e) => this.userMemoryTest(e));
        });
    }

    /**
     * @method userMemoryTest
     * Handles user input and checks whether the correct button is clicked in sequence.
     * @param {Event} event - The click event triggered by the user.
     */
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
    
    /**
     * @method normalizeColor
     * Converts a given color to a standardized format for comparison.
     * @param {string} color - The color string to normalize.
     * @returns {string} Normalized color string.
     */
    normalizeColor(color) {
        const tempDiv = document.createElement("div");
        tempDiv.style.color = color;
        document.body.appendChild(tempDiv);
        const normalizedColor = window.getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);
        return normalizedColor;
    }

    /**
     * @method revealCorrectOrder
     * Reveals the correct order of the buttons to the user.
     */
    revealCorrectOrder() {
        console.log("Revealing correct order...");
        const buttons = Array.from(this.boxBlock.querySelectorAll(".box-button"));
        buttons.forEach((button, index) => {
            button.textContent = index + 1;
        });
    }
}
/**
 * @class MessageDisplay
 * @description Displays feedback messages to the user based on their actions in the game.
 *              File: js/MessageDisplay.js
 */
class MessageDisplay {
    /**
     * @constructor
     * Initializes the MessageDisplay class with the messages object.
     */
    constructor() {
        this.messages = messages; 
    }

    /**
     * @method displayMessage
     * Displays a message to the user in the form container and removes it after a timeout.
     * @param {string} msgKey - The key of the message to display from the messages object.
     * @param {string} [additionalInfo=""] - Additional information to append to the message.
     */
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

// Game is automatically ready when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    new InitializeGame();
});