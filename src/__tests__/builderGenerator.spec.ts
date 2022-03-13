import * as path from 'path';
import { generateBuilders } from '../builderGenerator';
import * as fs from 'fs';

describe('Builder Generator', () => {
  it('should generate builders for types', async () => {
    const simpleBuildersExample = path.join(
      __dirname,
      './examples/simpleTypes.ts',
    );
    const outputFolder = path.join(__dirname, 'output/simple-types');
    cleanOutput(outputFolder);

    await generateBuilders(simpleBuildersExample, outputFolder);

    const indexFile = fs.readFileSync(`${outputFolder}/index.ts`, 'utf8');
    const ScalarsBuilderFile = fs.readFileSync(
      `${outputFolder}/ScalarsBuilder.ts`,
      'utf8',
    );
    const SimpleExampleBuilderFile = fs.readFileSync(
      `${outputFolder}/SimpleExampleBuilder.ts`,
      'utf8',
    );
    const simpleTypesFile = fs.readFileSync(
      `${outputFolder}/simpleTypes.ts`,
      'utf8',
    );

    expect(fs.readdirSync(outputFolder)).toEqual([
      'ScalarsBuilder.ts',
      'SimpleExampleBuilder.ts',
      'index.ts',
      'simpleTypes.ts',
    ]);
    expect(indexFile).toMatchSnapshot();
    expect(ScalarsBuilderFile).toMatchSnapshot();
    expect(SimpleExampleBuilderFile).toMatchSnapshot();
    expect(simpleTypesFile).toMatchSnapshot();
  });

  it('should generate builders for interfaces', async () => {
    const simpleBuildersExample = path.join(
      __dirname,
      './examples/simpleInterfaces.ts',
    );
    const outputFolder = path.join(__dirname, 'output/simple-interfaces');
    cleanOutput(outputFolder);

    await generateBuilders(simpleBuildersExample, outputFolder);

    const indexFile = fs.readFileSync(`${outputFolder}/index.ts`, 'utf8');
    const ScalarsBuilderFile = fs.readFileSync(
      `${outputFolder}/ScalarsBuilder.ts`,
      'utf8',
    );
    const SimpleExampleBuilderFile = fs.readFileSync(
      `${outputFolder}/SimpleExampleBuilder.ts`,
      'utf8',
    );
    const simpleInterfacesFile = fs.readFileSync(
      `${outputFolder}/simpleInterfaces.ts`,
      'utf8',
    );

    expect(fs.readdirSync(outputFolder)).toEqual([
      'ScalarsBuilder.ts',
      'SimpleExampleBuilder.ts',
      'index.ts',
      'simpleInterfaces.ts',
    ]);
    expect(indexFile).toMatchSnapshot();
    expect(ScalarsBuilderFile).toMatchSnapshot();
    expect(SimpleExampleBuilderFile).toMatchSnapshot();
    expect(simpleInterfacesFile).toMatchSnapshot();
  });

  it('should generate builders for interfaces and types', async () => {
    const simpleBuildersExample = path.join(
      __dirname,
      './examples/simpleInterfacesAndTypes.ts',
    );
    const outputFolder = path.join(
      __dirname,
      'output/simple-interfaces-and-types',
    );
    cleanOutput(outputFolder);

    await generateBuilders(simpleBuildersExample, outputFolder);

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
    expect(indexFile).toMatchSnapshot();
    expect(ScalarsBuilderFile).toMatchSnapshot();
    expect(SimpleExampleBuilderFile).toMatchSnapshot();
    expect(simpleInterfacesAndTypesFile).toMatchSnapshot();
    expect(NestedTypeExampleBuilderFile).toMatchSnapshot();
  });

  it('should generate builders for empty type', async () => {
    const simpleBuildersExample = path.join(
      __dirname,
      './examples/ignoreEmptyTypes.ts',
    );
    const outputFolder = path.join(__dirname, 'output/ignore-empty-types');
    cleanOutput(outputFolder);

    await generateBuilders(simpleBuildersExample, outputFolder);

    const indexFile = fs.readFileSync(`${outputFolder}/index.ts`, 'utf8');
    const SimpleExampleBuilderFile = fs.readFileSync(
      `${outputFolder}/SimpleExampleBuilder.ts`,
      'utf8',
    );

    expect(fs.readdirSync(outputFolder)).toEqual([
      'SimpleExampleBuilder.ts',
      'ignoreEmptyTypes.ts',
      'index.ts',
    ]);
    expect(indexFile).toMatchSnapshot();
    expect(SimpleExampleBuilderFile).toMatchSnapshot();
  });

  it('should generate builders for union type', async () => {
    const simpleBuildersExample = path.join(
      __dirname,
      './examples/ignoreUnionTypes.ts',
    );
    const outputFolder = path.join(__dirname, 'output/ignore-union-types');
    cleanOutput(outputFolder);

    await generateBuilders(simpleBuildersExample, outputFolder);

    const indexFile = fs.readFileSync(`${outputFolder}/index.ts`, 'utf8');
    const SimpleExampleBuilderFile = fs.readFileSync(
      `${outputFolder}/SimpleExampleBuilder.ts`,
      'utf8',
    );

    expect(fs.readdirSync(outputFolder)).toEqual([
      'SimpleExampleBuilder.ts',
      'ignoreUnionTypes.ts',
      'index.ts',
    ]);
    expect(indexFile).toMatchSnapshot();
    expect(SimpleExampleBuilderFile).toMatchSnapshot();
  });

  it('should generate builders for types with __typename property', async () => {
    const simpleBuildersExample = path.join(
      __dirname,
      './examples/ignoreTypenameProp.ts',
    );
    const outputFolder = path.join(__dirname, 'output/ignore-typename-prop');
    cleanOutput(outputFolder);

    await generateBuilders(simpleBuildersExample, outputFolder);

    const indexFile = fs.readFileSync(`${outputFolder}/index.ts`, 'utf8');
    const SimpleExampleBuilderFile = fs.readFileSync(
      `${outputFolder}/SimpleExampleBuilder.ts`,
      'utf8',
    );

    expect(fs.readdirSync(outputFolder)).toEqual([
      'SimpleExampleBuilder.ts',
      'ignoreTypenameProp.ts',
      'index.ts',
    ]);
    expect(indexFile).toMatchSnapshot();
    expect(SimpleExampleBuilderFile).toMatchSnapshot();
  });

  it('should generate builders with null initializer', async () => {
    const simpleBuildersExample = path.join(
      __dirname,
      './examples/simpleInterfacesAndTypes.ts',
    );
    const outputFolder = path.join(
      __dirname,
      'output/simple-interfaces-and-types-null',
    );
    cleanOutput(outputFolder);

    await generateBuilders(simpleBuildersExample, outputFolder, {
      useNullInitializer: true,
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
    expect(indexFile).toMatchSnapshot();
    expect(ScalarsBuilderFile).toMatchSnapshot();
    expect(SimpleExampleBuilderFile).toMatchSnapshot();
    expect(simpleInterfacesAndTypesFile).toMatchSnapshot();
    expect(NestedTypeExampleBuilderFile).toMatchSnapshot();
  });
});

function cleanOutput(outputFolder: string) {
  if (fs.existsSync(outputFolder)) {
    fs.rmSync(outputFolder, { recursive: true, force: true });
  }
}
