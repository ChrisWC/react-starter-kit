import path from 'path';
import chokidar from 'chokidar';
import { copyFile, makeDir, cleanDir } from './lib/fs';

async function watch(options) {
  const watcher = chokidar.watch(['public/**/*'], { ignoreInitial: true });

  watcher.on('all', async (event, filePath) => {
    const src = path.relative('./', filePath);
    const dist = path.join(
      'build/',
      src.startsWith('src') ? path.relative('src', src) : src,
    );
    switch (event) {
      case 'add':
      case 'change':
        await makeDir(path.dirname(dist));
        await copyFile(filePath, dist);
        break;
      case 'unlink':
      case 'unlinkDir':
        cleanDir(dist, { nosort: true, dot: true });
        break;
      default:
        return;
    }
  });
}

export default watch;
