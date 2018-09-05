const path = require('path');
const tar = require('tar');
const fs = require('fs-extra');
const os = require('os');

/**
 * @TODO Combine tar with ipfs
 * First create a writeable tar stream and pull it through ipfs
 * Second create a readable stream from ipfs that gets pulled through tar and extracted
 */

const appData = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local');
const cachePath = path.join(appData, 'cattle', '.cache');
const dataPath = path.join(__dirname, '.data');

const pkg = {
  name: 'cattle',
  version: '1.0.0',
  tarball: () =>  `${pkg.name}-${pkg.version}.tgz`,
  cachePath: () => path.join(cachePath, pkg.tarball()),
};

function extractTarball(stream) {
  stream.pipe(
    tar.extract({
      strip: 1,
      cwd: dataPath,
    }),
  );
}

(async () => {
  const tarballPath = pkg.cachePath();
  const isCached = await fs.pathExists(tarballPath);

  if (!isCached) {
    const IPFS = require('ipfs');
    const node = new IPFS();

    node.on('ready', async () => {
      await fs.ensureDir(cachePath);
      const version = await node.version();
      console.log('Version:', version.version);

      await tar.create({
        gzip: true,
        file: tarballPath,
      }, ['./packages/cli']);

      const stream = fs.createReadStream(tarballPath);
      const filesAdded = await node.files.add({
        path: pkg.tarball(),
        content: stream,
      });

      console.log('Added file:', filesAdded[0].path, filesAdded[0].hash);

      const readableTarball = await node.files.catReadableStream(filesAdded[0].hash);
      extractTarball(readableTarball);

      console.log('Succesfully installed: ' + `${pkg.name}@${pkg.version}`);

      await node.stop();
    });
  } else {
    const stream = fs.createReadStream(tarballPath);
    extractTarball(stream);

    console.log('Succesfully installed: ' + `${pkg.name}@${pkg.version}` + ' from cache');
  }
})();