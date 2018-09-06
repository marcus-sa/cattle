import { CommanderStatic } from 'commander';

import { AbstractCommand } from './abstract.command';

export class ButcherCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command('butcher <package>')
      .description('Remove a dependency')
      .action(() => {});
  }
}
