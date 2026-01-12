import { join } from 'path';
import * as fs from 'fs';
import * as express from 'express';

export function serveStaticFiles(
  server: express.Express,
  pathGetter: () => string,
  urlPrefix: string,
) {
  server.use(urlPrefix, (req, res, next) => {
    const filePath = join(pathGetter(), req.path);
    console.log('[Static] Requested file:', filePath);
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        console.log('[Static] File not found:', filePath);
        res.status(404).send('File not found');
        return;
      }
      next();
    });
  });

  server.use(urlPrefix, express.static(pathGetter()));
}
