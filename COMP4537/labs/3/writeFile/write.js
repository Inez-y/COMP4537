const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = 3000;
const FILE_NAME = '../file.txt'; // hardcoded by lab instruction
const PATH = '/COMP4537/labs/3/writeFile';

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    // if (path === PATH) {
        if (query.text) {
            fs.appendFile(FILE_NAME, query.text + ' \n', (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error writing to file.');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(`Text "${query.text}" appended to file.txt`);
                }
            });
        // } else {
        //     res.writeHead(400, { 'Content-Type': 'text/plain' });
        //     res.end('Error: No text provided.');
        // }
    }

});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
