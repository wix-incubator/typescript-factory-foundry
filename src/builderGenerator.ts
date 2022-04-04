import {
  ClassDeclarationStructure,
  FunctionDeclarationStructure,
  IndentationText,
  InterfaceDeclaration,
  MethodDeclarationStructure,
  Project,
  QuoteKind,
  Scope,
  StructureKind,
  ts,
  Type,
  TypeAliasDeclaration,
} from 'ts-morph';
import * as path from 'path';
import { copyFile } from 'fs/promises';

const builderExtensionName = 'Builder';
const builderFunctionNamePrefix = 'a';
const valueParameterTypeName = 'P';

export interface BuilderOptions {
  useNullInitializer?: boolean;
}

export async function generateBuilders(
  inputFilePath: string,
  outputFilePath: string,
  options: BuilderOptions = {},
): Promise<void> {
  const project = new Project({
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      quoteKind: QuoteKind.Single,
    },
    compilerOptions: {
      strictNullChecks: true,
    },
  });
  project.addSourceFileAtPath(inputFilePath);
  const fileName = path.basename(inputFilePath);
  const fileNameWithoutExtension = path.basename(
    inputFilePath,
    path.extname(inputFilePath),
  );
  const sourceFile = project.getSourceFileOrThrow(fileName);

  project.createDirectory(outputFilePath);

  const allTypes = sourceFile.getTypeAliases();
  const allInterfaces = sourceFile.getInterfaces();

  const classesAndFactories: {
    classObj: ClassDeclarationStructure;
    builderFunc: FunctionDeclarationStructure;
    importedBuilders: Set<string>;
  }[] = [];

  const indexFile = project.createSourceFile(
    path.join(outputFilePath, 'index.ts'),
    undefined,
    {
      overwrite: true,
      scriptKind: ts.ScriptKind.TS,
    },
  );

  const typesToGenerate = [...allTypes, ...allInterfaces];
  for (const typeToGenerate of typesToGenerate) {
    const { classObj, builderFunc, importedBuilders } = generateBuilderFunc(
      typeToGenerate,
      options,
    );
    if (classObj && builderFunc) {
      classesAndFactories.push({
        classObj,
        builderFunc,
        importedBuilders,
      });
    }
  }

  const promises = classesAndFactories.map(
    async ({ classObj, builderFunc, importedBuilders }) => {
      const outFile = project.createSourceFile(
        path.join(outputFilePath, `${classObj.name}.ts`),
        undefined,
        {
          overwrite: true,
          scriptKind: ts.ScriptKind.TS,
        },
      );

      outFile.addStatements([
        '/* eslint-disable */',
        {
          kind: StructureKind.ImportDeclaration,
          namedImports: ['DeepPartial'],
          moduleSpecifier: 'ts-essentials',
        },
        {
          kind: StructureKind.ImportDeclaration,
          namespaceImport: 'SchemaTypes',
          moduleSpecifier: `./${fileNameWithoutExtension}`,
        },
        {
          kind: StructureKind.ImportDeclaration,
          namedImports: ['cloneDeep'],
          moduleSpecifier: 'lodash',
        },
        ...Array.from(importedBuilders),
      ]);

      indexFile.addExportDeclaration({
        kind: StructureKind.ExportDeclaration,
        moduleSpecifier: `./${classObj.name}`,
      });

      outFile.addClass(classObj);
      outFile.addFunction(builderFunc);

      await outFile.save();
      return copyFile(inputFilePath, `${outputFilePath}/${fileName}`);
    },
  );

  return Promise.all([...promises, indexFile.save()]).then();
}

function generateBuilderFunc(
  typeAlias: TypeAliasDeclaration | InterfaceDeclaration,
  { useNullInitializer }: BuilderOptions,
) {
  const importedBuilders = new Set<string>();
  const rootType = typeAlias.getType();

  const props = rootType.getProperties();

  if (props.length <= 0) {
    return {};
  }

  if (rootType.isUnion()) {
    console.warn(`Skipped type generation for union: ${typeAlias.getName()}`);

    return {};
  }

  const objName = 'obj';
  const typeName = typeAlias.getName();
  const className = `${typeName}${builderExtensionName}`;

  const methods: MethodDeclarationStructure[] = [];
  for (const prop of props) {
    const propName = prop.getName();
    if (propName === '__typename') {
      continue;
    }
    const type = prop.getTypeAtLocation(prop.getValueDeclarationOrThrow());
    const isUnion = type.isUnion();
    const unionTypes = isUnion ? type.getUnionTypes() : [type];

    const parametersType = unionTypes
      .map(builderParameterTypeMapper)
      .filter((t) => t !== 'false')
      .map((t) => (t === 'true' ? 'boolean' : t))
      .join(' | ');

    const builderMethodParameterDefinition = addBuilderMethodToImports({
      type,
      isUnion,
      propName,
      importedBuilders,
    });
    const method: MethodDeclarationStructure = {
      kind: StructureKind.Method,
      name: `with${capitalizeFirstLetter(propName)}`,
      returnType: className,
      typeParameters: [`${valueParameterTypeName} extends ${parametersType}`],
      parameters: [
        { name: 'val', type: builderMethodParameterDefinition.name },
      ],
      scope: Scope.Public,
      statements: [builderMethodParameterDefinition.statement, 'return this;'],
    };
    methods.push(method);
  }

  methods.push({
    kind: StructureKind.Method,
    name: 'includeTypename',
    scope: Scope.Public,
    statements: [
      '// @ts-ignore',
      `this.obj.__typename = '${typeName}';`,
      'return this;',
    ],
  });

  methods.push({
    kind: StructureKind.Method,
    name: 'get',
    scope: Scope.Public,
    returnType: `SchemaTypes.${typeName}`,
    statements: `return cloneDeep(this.obj) as SchemaTypes.${typeName};`,
  });

  const builderFunc: FunctionDeclarationStructure = {
    kind: StructureKind.Function,
    name: `${builderFunctionNamePrefix}${className}`,
    isExported: true,
    typeParameters: [`O extends DeepPartial<SchemaTypes.${typeName}> = {}`],
    returnType: `${className}`,
    parameters: [
      {
        name: 'baseObj',
        type: 'O',
        hasQuestionToken: true,
      },
    ],
    statements: `return new ${className}(baseObj ?? {});`,
  };

  const constructorInitializer = useNullInitializer
    ? props
        .filter((prop) => prop.getName() !== '__typename')
        .map((prop) => `${prop.getName()}: null`)
        .join(', ')
    : '';
  const classObj: ClassDeclarationStructure = {
    kind: StructureKind.Class,
    name: className,
    ctors: [
      {
        kind: StructureKind.Constructor,
        parameters: [
          {
            name: objName,
            initializer: `{${constructorInitializer}} as DeepPartial<SchemaTypes.${typeName}>`,
            isReadonly: true,
            scope: Scope.Private,
          },
        ],
      },
    ],
    methods,
    isExported: true,
  };

  return { builderFunc, classObj, importedBuilders };
}

function addBuilderMethodToImports({
  type,
  isUnion,
  propName,
  importedBuilders,
}: {
  type: Type<ts.Type>;
  isUnion: boolean;
  propName: string;
  importedBuilders: Set<string>;
}): { name: string; statement: string } {
  if (
    !isUnion &&
    type.isClassOrInterface() &&
    type.getProperties().length > 0
  ) {
    const { builderMethodName, builderMethodFileName } =
      getBuilderMethodDefinition(type);
    importedBuilders.add(
      `import {${builderMethodName}} from './${builderMethodFileName}';`,
    );
    const builderType = `ReturnType<typeof ${builderMethodName}>`;
    const valueFunctionParameterType = `((builder: ${builderType}) => ${builderType})`;
    return {
      name: `${valueParameterTypeName} | ${valueFunctionParameterType}`,
      statement: `this.obj.${propName} = typeof val === 'function' ? val(${builderMethodName}()).get() : val;`,
    };
  }
  return {
    name: valueParameterTypeName,
    statement: `this.obj.${propName} = val;`,
  };
}

function getBuilderMethodDefinition(type: Type<ts.Type>): {
  builderMethodName: string;
  builderMethodFileName: string;
} {
  const typeForBuilderFunction = extractTypeName(type);
  const builderMethodFileName = `${typeForBuilderFunction}${builderExtensionName}`;
  const builderMethodName = `${builderFunctionNamePrefix}${builderMethodFileName}`;
  return { builderMethodName, builderMethodFileName };
}

function builderParameterTypeMapper(subType: Type): string {
  const isArray = subType.isArray();
  const resultType = isArray ? subType.getArrayElementType()! : subType;
  const isPrimitive = isPrimitiveType(resultType);

  let resultTypeStr = resultType
    .getText()
    .replace(/import\("[^"]*"\)/gi, 'SchemaTypes');

  resultTypeStr = isPrimitive
    ? `${resultTypeStr}`
    : `DeepPartial<${resultTypeStr}>`;

  return isArray ? `${resultTypeStr}[]` : resultTypeStr;
}

function isPrimitiveType(resultType: Type<ts.Type>) {
  return [
    resultType.isString(),
    resultType.isNumber(),
    resultType.isLiteral(),
    resultType.isBoolean(),
    resultType.isUndefined(),
    resultType.isNull(),
    resultType.isAny(),
    resultType.isEnum(),
  ].some(Boolean);
}

function extractTypeName(type: Type): string {
  return type.getText().replace(/import\("[^"]*"\)\./gi, '');
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
