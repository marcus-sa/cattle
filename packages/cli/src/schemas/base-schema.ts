export interface BaseSchema {
  name: string;
  version: string;
  // @TODO: How tf do I do this in class-validator ?
  dependencies?: {
    [name: string]: string;
  }[];
}