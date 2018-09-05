const IPFS = require('ipfs');
const path = require('path');
const tar = require('tar');
const fs = require('fs');

const node = new IPFS();

/**
 * @TODO Combine tar with ipfs
 * First create a writeable tar stream and pull it through ipfs
 * Second create a readable stream from ipfs that gets pulled through tar and extracted
 */

node.on('ready', async () => {
  const version = await node.version();

  console.log('Version:', version.version);
  const pkg = './.data/cattle-1.0.0.tgz';

  /*const filesAdded = await node.files.add({
    path: 'hello.txt',
    content: Buffer.from('Hello World 101')
  });*/

  await tar.create({
    gzip: true,
    file: pkg,
  }, ['./packages/cli']);

  const stream = fs.createReadStream(pkg);
  const filesAdded = await node.files.add({
    path: pkg,
    content: stream,
  });

  console.log('Added file:', filesAdded[0].path, filesAdded[0].hash);

  const fileBuffer = await node.files.cat(filesAdded[0].hash);
  await tar.extract();

  console.log('Added file contents:', fileBuffer.toString());
});