#!/usr/bin/env node
import { cattle } from '../src/cattle';

cattle(process.argv).catch(console.error);