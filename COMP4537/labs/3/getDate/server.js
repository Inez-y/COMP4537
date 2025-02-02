const http = require('http');
const url = require('url');
const path = require('path');
const messages = require("./en/en.json"); // Import messages
const dateModule = require("./modules/utils"); // Import getDate function

const address = "https://lab-3kcxx.ondigitalocean.app/COMP4537/labs/3/getDate";

const PORT = process.env.PORT || 8000; // Use environment port or default to 8000
const HOST = '0.0.0.0'; // Allow external access

// Create an HTTP server
http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    let pathname = q.pathname;

    // Ensure it only runs on the correct endpoint
    if (pathname === "/COMP4537/labs/3/getDate/") {
        let qdata = q.query;
        let name = qdata.name || "Guest"; // Default to "Guest" if name is not provided
        let responseMessage = `<p style="color:blue;">${messages.greeting.replace("%1", name)} ${dateModule()}</p>`;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(responseMessage);
        res.end();
    } else {
        // Handle 404 Not Found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write("<h1>404 Not Found</h1>");
        res.end();
    }
}).listen(PORT, HOST, () => {
    console.log(`Server running at http://your-server-ip:${PORT}/`);
});
