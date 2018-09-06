import commander from 'commander';

import { CommandLoader } from './commands';
import { Schema, CattleFarmSchema } from './schemas';

const { version } = require('../../../package.json');

export async function cattle(cliArgs: string[]) {
  const schema = new Schema();
  /*await schema.register({
    'cattle-farm': CattleFarmSchema,
  });*/

  commander.version(version);
  CommandLoader.load(schema, commander);
  commander.parse(cliArgs);
}
