import { CommanderStatic } from 'commander';

import { AbstractCommand } from './abstract.command';

export class BreedCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command('breed <package:version>')
      .alias('B')
      .description('Install a package from the registry')
      .action(() => {});
  }
}