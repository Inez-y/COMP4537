// get name via the browsers bar
// greet person and return the current time of the server

// Server side message - in-line styling with blue colour
// Hello John, What a beautiful day. Server current date and time is *  Wed Sept 01 2023 12:52:14 GMT-0800 (Pacific Standard Time)

const http = require('http');
const url = require('url');
const messages = require("./en/en.json"); // Import messages
const dateModule = require("./modules/utils"); // Import getDate function

// Create an HTTP server
http.createServer((req, res) => {
    // Parse the incoming request URL to extract query parameters
    let q = url.parse(req.url, true);
    let qdata = q.query; // Extract query parameters

    let name = qdata.name || "Guest"; // Default to "Guest" if name is not provided
    let responseMessage = `<p style="color:blue;">${messages.greeting.replace("%1", name)} ${dateModule.getDate()}</p>`;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(responseMessage);
    res.end();
}).listen(8000, () => {
    console.log("Server is running at https://lab-3kcxx.ondigitalocean.app/COMP4537/labs/3/getDate/");
});
