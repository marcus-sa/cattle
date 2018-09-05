import { CommanderStatic } from 'commander';

import { BreedCommand } from './breed.command';
import { ButcherCommand } from './butcher.command';

import { BreedAction, ButcherAction } from '../actions';

export class CommandLoader {
  public static load(program: CommanderStatic) {
    new BreedCommand(new BreedAction()).load(program);
    new ButcherCommand(new ButcherAction()).load(program);
  }
}