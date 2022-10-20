import * as path from 'path';
import { generateBuilders } from '../builderGenerator';
import * as fs from 'fs';

jest.setTimeout(15_000);

describe('Builder Generator { enableSubBuilders: true }', () => {
  it('should generate builders for interfaces and types', async () => {
    const simpleBuildersExample = path.join(
      __dirname,
      './examples/simpleInterfacesAndTypes.ts',
    );
    const outputFolder = path.join(
      __dirname,
      'output/simple-interfaces-and-types-enabled-nested',
    );
    cleanOutput(outputFolder);

    await generateBuilders(simpleBuildersExample, outputFolder, {
      enableSubBuilders: true,
    });

    const indexFile = fs.readFileSync(`${outputFolder}/index.ts`, 'utf8');
    const ScalarsBuilderFile = fs.readFileSync(
      `${outputFolder}/ScalarsBuilder.ts`,
      'utf8',
    );
    const SimpleExampleBuilderFile = fs.readFileSync(
      `${outputFolder}/SimpleExampleBuilder.ts`,
      'utf8',
    );
    const simpleInterfacesAndTypesFile = fs.readFileSync(
      `${outputFolder}/simpleInterfacesAndTypes.ts`,
      'utf8',
    );
    const NestedTypeExampleBuilderFile = fs.readFileSync(
      `${outputFolder}/NestedTypeExampleBuilder.ts`,
      'utf8',
    );

    expect(fs.readdirSync(outputFolder)).toEqual([
      'NestedTypeExampleBuilder.ts',
      'ScalarsBuilder.ts',
      'SimpleExampleBuilder.ts',
      'index.ts',
      'simpleInterfacesAndTypes.ts',
    ]);
    expect(NestedTypeExampleBuilderFile).toMatchSnapshot();
    expect(ScalarsBuilderFile).toMatchSnapshot();
    expect(SimpleExampleBuilderFile).toMatchSnapshot();
    expect(simpleInterfacesAndTypesFile).toMatchSnapshot();
    expect(indexFile).toMatchSnapshot();
  });
});

function cleanOutput(outputFolder: string) {
  if (fs.existsSync(outputFolder)) {
    fs.rmSync(outputFolder, { recursive: true, force: true });
  }
}
