# Typescript Builders Generator
This project allows you to generate definitely typed builders based on typescript `interface` and `type`.

## Why?
Because you can't go wrong with definitely typed DTO.
There are many cases when we use DTOs during development:
- To create mock data for tests.
- To pass data between client and server.
- To handle large configuration objects.
- And many other cases...

*Great, but why builders?*
- **No need to declare types** - no need to bother with predefining types for variables, simply use the builder and you'll receive the concrete type directly from the builder.
- **Precise types** - by using builders paradigm you can effectively enforce objects to have only properties that exist in their interface. Enforcing this helps you avoid "magic" properties on the object that could be used throughout the code.
- **always up-to-date builders** - By adding this as build step you can easily identify changes to properties (like that annoying moment when a property has a typo fix and you only realize it after 10 hours of debugging).
- **Reusability** - builders are modular, meaning they can be reused between objects, so you can define a meaningful builder and call the `builder.get()` function to receive a new instance with the same configuration whenever you need it.

## Usage
You can use this package either via CLI or by using the `generateBuilders` function.

Generating builders via CLI:
```bash
npx @wix/typescript-builders-generator <full-path-to-ts-file> <full-path-to-output-directory>
```

Generating builders via `package.json` script:
```json
"generate": "generate-builders <full-or-relative-path-to-ts-file> <full-or-relative-path-to-output-directory>"
```

Generating builders from code:
```typescript
import {generateBuilders} from '@wix/typescript-builders-generator'

// returns a promise that's resolved when task is finished
generateBuilders(fullOrRelativePathToTsFile, fullOrRelativePathToOutputDirectory);
```

## Example Builder Generation
Assume we have the following project structure:
```bash
src
├── types.ts
└── ...
```

And that the file `types.ts` has the following content:
```typescript
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: number;
  Json: any;
  Long: number;
};

export interface SimpleExample {
  prop1: Scalars['Boolean'];
  prop2: number;
  prop3: {
    innerProp: string;
  };
}
```

Then by running the following command from `package.json` file:
```json
"generate": "generate-builders ./types.ts ./generated"
```

We'll receive the following new files:
```bash
src
├── types.ts
├── generated
│   ├── types.ts
│   ├── index.ts
│   ├── ScalarsBuilder.ts
│   └── SimpleExampleBuilder.ts
└── ...
```

Which will look like this:
```typescript
//index.ts
export * from './ScalarsBuilder';
export * from './NestedTypeExampleBuilder';
export * from './SimpleExampleBuilder';

// types.ts
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: number;
  Json: any;
  Long: number;
};

export interface SimpleExample {
  prop1: Scalars['Boolean'];
  prop2: number;
  prop3: {
    innerProp: string;
  };
}

// ScalarsBuilder.ts
/* eslint-disable */
import { DeepPartial } from 'ts-essentials';
import * as SchemaTypes from './simpleInterfacesAndTypes';

export class ScalarsBuilder {
  constructor(private readonly obj = {} as DeepPartial<SchemaTypes.Scalars>) {
  }

  public withID<P extends string>(val: P): ScalarsBuilder {
    this.obj.ID = val;
    return this;
  }

  public withString<P extends string>(val: P): ScalarsBuilder {
    this.obj.String = val;
    return this;
  }

  public withBoolean<P extends boolean>(val: P): ScalarsBuilder {
    this.obj.Boolean = val;
    return this;
  }

  public withInt<P extends number>(val: P): ScalarsBuilder {
    this.obj.Int = val;
    return this;
  }

  public withFloat<P extends number>(val: P): ScalarsBuilder {
    this.obj.Float = val;
    return this;
  }

  public withBigDecimal<P extends number>(val: P): ScalarsBuilder {
    this.obj.BigDecimal = val;
    return this;
  }

  public withJson<P extends any>(val: P): ScalarsBuilder {
    this.obj.Json = val;
    return this;
  }

  public withLong<P extends number>(val: P): ScalarsBuilder {
    this.obj.Long = val;
    return this;
  }

  public includeTypename() {
    // @ts-ignore
    this.obj.__typename = 'Scalars';
    return this;
  }

  public get(): SchemaTypes.Scalars {
    return this.obj as SchemaTypes.Scalars;
  }
}

export function aScalarsBuilder<O extends DeepPartial<SchemaTypes.Scalars> = {}>(baseObj?: O): ScalarsBuilder {
  return new ScalarsBuilder(baseObj ?? {});
}


// SimpleExampleBuilder.ts
/* eslint-disable */
import { DeepPartial } from 'ts-essentials';
import * as SchemaTypes from './simpleInterfacesAndTypes';

export class SimpleExampleBuilder {
  constructor(private readonly obj = {} as DeepPartial<SchemaTypes.SimpleExample>) {
  }

  public withProp1<P extends boolean>(val: P): SimpleExampleBuilder {
    this.obj.prop1 = val;
    return this;
  }

  public withProp2<P extends number>(val: P): SimpleExampleBuilder {
    this.obj.prop2 = val;
    return this;
  }

  public withProp3<P extends DeepPartial<{ innerProp: string; }>>(val: P): SimpleExampleBuilder {
    this.obj.prop3 = val;
    return this;
  }

  public includeTypename() {
    // @ts-ignore
    this.obj.__typename = 'SimpleExample';
    return this;
  }

  public get(): SchemaTypes.SimpleExample {
    return this.obj as SchemaTypes.SimpleExample;
  }
}

export function aSimpleExampleBuilder<O extends DeepPartial<SchemaTypes.SimpleExample> = {}>(baseObj?: O): SimpleExampleBuilder {
  return new SimpleExampleBuilder(baseObj ?? {});
}
```

## How to use the builders:
First use the builder function to initialize a builder:
```typescript
const builder = aSimpleExampleBuilder();
```

Then add the properties you want:
```typescript
builder.withProp1(true);
builder.withProp2(15).withProp3({innerProp: 'inner prop'});
```

When all the properties you want to have on the object are present, call the `get()` method to receive a concrete object:
```typescript
const item1 = builder.get(); // concrete object of the builder type
const item2 = builder.get(); // a different object of the same builder

// you can add more properties to builder and call the 'get()' method again
const itemWithTypename = builder.includeTypename().get();
```

This gives you an easy way to reuse builders:
```typescript
const simpleExampleBuilder = aSimpleExampleBuilder();
simpleExampleBuilder.withProp1(true);
simpleExampleBuilder.withProp2(15).withProp3({innerProp: 'inner prop'});

const builder = aNestedTypeExampleBuilder();
// 2 clones of the same object structure and values
builder.withNestedProp1(simpleExampleBuilder.get());
builder.withNestedProp2({simple: simpleExampleBuilder.get()});
const nestedItem = builder.get();
```
