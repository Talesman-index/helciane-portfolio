const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5173;
const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
  let reqUrl = decodeURI(req.url.split('?')[0]);
  if (reqUrl === '/' || reqUrl === '') {
    reqUrl = '/index.html';
  }

  let filePath = path.resolve(ROOT, '.' + reqUrl);

  // Security: avoid path traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Non trouvé: ${reqUrl}`);
      return;
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isVideo = ext === '.mp4' || ext === '.mov' || ext === '.webm';

    if (isVideo) {
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        let start = parseInt(parts[0], 10);
        let end = parseInt(parts[1], 10);

        if (isNaN(start)) {
          start = stats.size - end;
          end = stats.size - 1;
        } else if (isNaN(end)) {
          end = stats.size - 1;
        }

        if (start < 0) start = 0;
        if (end >= stats.size) end = stats.size - 1;

        if (start > end || start >= stats.size) {
          res.writeHead(416, {
            'Content-Range': `bytes */${stats.size}`,
            'Accept-Ranges': 'bytes'
          });
          res.end();
          return;
        }

        const chunksize = (end - start) + 1;
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });

        if (req.method === 'HEAD') {
          res.end();
          return;
        }

        const fileStream = fs.createReadStream(filePath, { start, end });
        fileStream.on('error', () => {});
        res.on('close', () => fileStream.destroy());
        fileStream.pipe(res);
        return;
      } else {
        res.writeHead(200, {
          'Content-Length': stats.size,
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'no-cache'
        });

        if (req.method === 'HEAD') {
          res.end();
          return;
        }

        const fileStream = fs.createReadStream(filePath);
        fileStream.on('error', () => {});
        res.on('close', () => fileStream.destroy());
        fileStream.pipe(res);
        return;
      }
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Erreur serveur: ${readErr.code}`);
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
          'Content-Length': stats.size,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        if (req.method === 'HEAD') {
          res.end();
          return;
        }
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n✨ Portfolio Helciane Houngbadji disponible sur : http://localhost:${PORT}\n`);
});
