/**
 * @file messages.js
 * @description This module defines a collection of user-facing messages for the Memory Game application.
 * These messages provide feedback to the user based on their actions or inputs during the game.
 *
 * @constant {Object} messages
 * @property {string} invalidInput - Message displayed when the user provides an invalid input (e.g., not a number between 3 and 7).
 * @property {string} excellentMemory - Message displayed when the user successfully remembers the correct order of buttons.
 * @property {string} wrongOrder - Message displayed when the user clicks the buttons in the wrong order.
 *
 * @example
 * import messages from "./path/to/messages.js";
 * 
 * The Docstring format was given by ChatGPT
 */
window.messages = {
    invalidInput: "Please enter a number between 3 and 7.",
    excellentMemory: "Excellent memory!",
    wrongOrder: "Wrong order!",
};

// Export the messages object for use in other files
export default messages;
