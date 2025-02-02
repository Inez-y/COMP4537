const http = require('http');
const url = require('url');
const messages = require("./en/en.json"); // Import messages
const dateModule = require("./modules/utils"); // Import getDate function
const address = "https://lab-3kcxx.ondigitalocean.app/COMP4537/labs/3/getDate";

const PORT = process.env.PORT || 8000; // Use environment port or default to 8000
const HOST = '0.0.0.0'; // Allows external access

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
}).listen(PORT, HOST, () => {
    console.log(`Server is running at ${address}`);
});
