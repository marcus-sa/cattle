import * as commander from 'commander';

import { CommandLoader } from './commands';
import { Schema } from './schemas';

const { version } = require('../../../package.json');

export async function cattle(
  cliArgs: string[],
) {
  commander.version(version);
  CommandLoader.load(commander);
  await Schema.register([
    'cattle-farm',
    'cattle-lockfile',
  ]);
  commander.parse(cliArgs);
}