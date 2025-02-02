const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = 3000;
const FILE_NAME = '../file.txt'; // hardcoded by the lab instruction
const PATH = '/COMP4537/labs/3/writeFile';

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname; 
    const query = parsedUrl.query; //filename
    console.log(query);

    // if (path === PATH) {
        fs.readFile(FILE_NAME, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`Error: File "${FILE_NAME}" not found.`);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(data);
            }
        })
    // } else {
    //     res.writeHead(404, { 'Content-Type': 'text/plain' });
    //     res.end('Error: Invalid endpoint');
     //}
    }
);

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
