import * as inquirer from 'inquirer';
import { Questions } from 'inquirer';
import * as fs from 'fs-extra';

import { ICattleFarmSchema } from '../schemas';

import { AbstractAction } from './abstract.action';

export class RanchAction extends AbstractAction {
  public async handle() {
    const prompt = inquirer.createPromptModule();
    const cattleFarmFile = this.getCattleFarmPath();
    const didRanch = await fs.pathExists(cattleFarmFile);

    if (
      didRanch &&
      !(await prompt<{ answer: boolean }>({
        type: 'confirm',
        name: 'answer',
        default: false,
        message: `Seems like you've already initialized Cattle once - Do it again?`,
      })).answer
    )
      return;

    const questions: Questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name',
        validate: this.validateString('Project name'),
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description',
        validate: this.validateString('Project description'),
      },
    ];

    const schema = await prompt<ICattleFarmSchema>(questions);
    await this.schema.write(cattleFarmFile, schema);
  }
}
