#!/usr/bin/env node
import * as commander from 'commander';

import { CommandLoader } from './commands';
import { Schema } from './schemas';

(async () => {
	commander.version(require('../../package.json').version);
	CommandLoader.load(commander);
  await Schema.register([
    'cattle-farm',
    'cattle-lockfile',
  ]);
	commander.parse(process.argv);
})();