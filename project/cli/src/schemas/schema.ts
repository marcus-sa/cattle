import { ValidationSchema } from 'class-validator';
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import * as fs from 'fs-extra';
import * as path from 'path';
import YAML from 'yaml';

export type ISchemas = { [name: string]: ClassType<any> };

export class Schema {
  private path(name: string) {
    return path.join(__dirname, `${name}.schema.yml`);
  }
  /*public async register(schemas: ISchemas) {
    await Promise.all(
      Object.keys(schemas).map(async (name) => {
        const schema = await this.read(this.path(name));
        registerSchema(schema);
      }),
    );
  }*/

  public async read<T = ValidationSchema>(path: string): Promise<T> {
    const schema = await fs.readFile(path, 'utf8');
    return YAML.parse(schema);
  }

  public async write<T = ValidationSchema>(path: string, schema: T) {
    const yaml = YAML.stringify(schema);
    await fs.writeFile(path, yaml, 'utf8');
  }

  public async validate(
    schema: ClassType<any>,
    validationSchema: ValidationSchema,
  ) {
    await transformAndValidate(schema, validationSchema);
  }
}
