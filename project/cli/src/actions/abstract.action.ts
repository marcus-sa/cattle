import * as path from 'path';

import { CattleFarmSchema, Schema } from '../schemas';
import { CommandOptions } from '../options';

export interface Paths {
  cattleFarm: string;
  jsonPackage: string;
  cattleLockfile: string;
}

export abstract class AbstractAction {
  constructor(protected readonly schema: Schema) {}

  public abstract async handle(
    input?: string,
    options?: CommandOptions,
  ): Promise<void>;

  private getCwdFile(...paths: string[]) {
    return path.join(process.cwd(), ...paths);
  }

  private getPaths(): Paths {
    return {
      cattleFarm: this.getCwdFile('Cattle.farm'),
      jsonPackage: this.getCwdFile('package.json'),
      cattleLockfile: this.getCwdFile('Cattle.lockfile'),
    };
  }

  /*public async validateCattleLockfile() {
    const paths = this.getPaths();
    const schema = await this.schema.read(paths.cattleLockfile);
    await this.schema.validate('cattle-lockfile', schema);
  }*/

  public async validateCattleFarm() {
    const paths = this.getPaths();
    const schema = await this.schema.read(paths.cattleFarm);
    await this.schema.validate(CattleFarmSchema, schema);
  }

  protected validateString(name: string) {
    return (input: any) =>
      typeof input === 'string' || `${name} must be a string!`;
  }
}
