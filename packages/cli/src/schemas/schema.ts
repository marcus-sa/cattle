import { registerSchema } from 'class-validator';
import * as fs from 'fs-extra';
import * as path from 'path';
import YAML from 'yaml';

export class Schema {
  private static path(name: string) {
    return path.join(__dirname, `${name}.schema.yml`);
  }
  public static async register(schemas: string[]) {
    await Promise.all(
      schemas.map(async (name) => {
        const yaml = await fs.readFile(this.path(name), 'utf8');
        const schema = YAML.parse(yaml);
        registerSchema(schema);
      }),
    );
  }

  public static validate() {

  }
}