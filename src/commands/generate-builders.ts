#!/usr/bin/env node

import { Command } from 'commander';
import { generateBuilders } from '../builderGenerator';

interface generateBuilderOptions {
  useDefaultNulls?: boolean;
}

export const program = new Command();
program
  .version('1.0.0')
  .description(
    'generate builders for interfaces and types based on a given typescript file',
  )
  .argument('<source>', 'path to input file')
  .argument('<output>', 'path to output directory')
  .option(
    '-n, --use-default-nulls',
    'use null as default value in builder properties initializer',
    false,
  )
  .action(processCommand);

async function processCommand(
  source: string,
  output: string,
  { useDefaultNulls }: generateBuilderOptions,
) {
  await generateBuilders(source, output, {
    useNullInitializer: useDefaultNulls,
  });
  console.log('builders were generated successfully!');
}

program.showHelpAfterError();
program.showSuggestionAfterError();
program.parse();
