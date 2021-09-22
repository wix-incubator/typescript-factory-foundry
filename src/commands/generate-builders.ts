#!/usr/bin/env node

import { Command } from 'commander';
import { generateBuilders } from '../builderGenerator';

export const program = new Command();
program
  .version('1.0.0')
  .description(
    'generate builders for interfaces and types based on a given typescript file',
  )
  .argument('<source>', 'relative path to input file')
  .argument('<output>', 'relative path to output directory')
  .action(processCommand);

async function processCommand(source: string, output: string) {
  await generateBuilders(source, output);
  console.log('builders were generated successfully!');
}

program.showHelpAfterError();
program.showSuggestionAfterError();
program.parse();
