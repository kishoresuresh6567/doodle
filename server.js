const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const files = {'/':'index.html','/index.html':'index.html','/style.css':'style.css','/app.js':'app.js'};
const server = http.createServer((req,res)=>{const file=files[req.url.split('?')[0]];if(!file){res.writeHead(404);return res.end('Not found');}res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html');fs.createReadStream(path.join(__dirname,file)).pipe(res);});
let port = Number(process.env.PORT || 3000);
let retries = 0;
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT must be an integer between 1 and 65535.');
  process.exit(1);
}
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE' && retries < 20 && port < 65535) {
    console.log(`Port ${port} is busy; trying ${port + 1}...`);
    port += 1;
    retries += 1;
    server.listen(port, '0.0.0.0');
    return;
  }
  console.error(`Unable to start the server: ${error.message}`);
  process.exitCode = 1;
});
server.on('listening', () => console.log(`Little doodles: http://localhost:${port}`));
server.listen(port, '0.0.0.0');
