import { BaseSchema } from './base-schema';

export interface ICattleFarmSchema extends BaseSchema {
  description?: string;
  license?: string;
  files?: string[];
}