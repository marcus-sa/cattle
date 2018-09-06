import { CommanderStatic } from 'commander';

import { AbstractCommand } from './abstract.command';

export class RanchCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command('ranch')
      .description('Initialize Cattle')
      .action(() => this.action.handle());
  }
}
