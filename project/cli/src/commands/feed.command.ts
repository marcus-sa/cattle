import { CommanderStatic } from 'commander';

import { AbstractCommand } from './abstract.command';
import { FeedOptions } from '../options';

export class FeedCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command('feed [package]')
      .option(
        '-B, --barn <category>',
        'Add a dependency to different categories',
      )
      .description('Add a dependency')
      .action(async (feed: string, options: FeedOptions) => {
        try {
          await this.action.validateCattleFarm();
          await this.action.handle(feed, options);
        } catch (e) {
          console.log(e);
        }
      });
  }
}
