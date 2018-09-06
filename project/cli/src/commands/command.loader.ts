import { CommanderStatic } from 'commander';

import { BreedCommand } from './breed.command';
import { ButcherCommand } from './butcher.command';
import { RanchCommand } from './ranch.command';
import { FeedCommand } from './feed.command';

import { Schema } from '../schemas';
import {
  BreedAction,
  ButcherAction,
  FeedAction,
  RanchAction,
} from '../actions';

export class CommandLoader {
  public static load(schema: Schema, program: CommanderStatic) {
    new BreedCommand(new BreedAction(schema)).load(program);
    new ButcherCommand(new ButcherAction(schema)).load(program);
    new RanchCommand(new RanchAction(schema)).load(program);
    new FeedCommand(new FeedAction(schema)).load(program);
  }
}
