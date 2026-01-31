const { spawn } = require('child_process');
const fs = require('fs');
const server = spawn('node', ['server.js'], { encoding: 'utf8' });

let output = '';
server.stdout.on('data', (data) => {
    output += data.toString();
    console.log(data.toString());
    fs.writeFileSync('debug.txt', output);
});

server.stderr.on('data', (data) => {
    output += 'ERROR: ' + data.toString();
    console.error(data.toString());
    fs.writeFileSync('debug.txt', output);
});

setTimeout(() => {
    server.kill();
    process.exit(0);
}, 20000);
