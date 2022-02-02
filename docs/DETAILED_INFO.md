## Why Builders?
- Modifying properties is easy - adding or removing properties only affects the code that's calling the corresponding modifying functions, thereby reducing the amount of code that needs to adapt to this change (which is a very common case for DTOs).
- Reusability - builders are easy to define and reuse. Builders can act as a starting template for multiple objects, making them ideal for bulk item generation.
- Strictness - builders restrict modification of properties to existing properties on interface, effectively protecting you from relying on properties that don't exist on the interface and eliminating "magic" properties that may appear in the code.
- Separation of concerns - having a hierarchy of builders makes it easy to split concerns of different data handling in the code.

## What Are the Common Use Cases?
- To create mock data for tests.
- To split initialization of large objects in a consistent way.
- To handle configuration objects.
- To generate objects with custom logic.
- To initialize multiple items from the same template.
- And many other cases...

## Usages
You can use this package either via CLI or by using the `generateBuilders` function.

Generating builders via CLI:
```bash
npx typescript-factory-foundry <full-path-to-ts-file> <full-path-to-output-directory>
```

Generating builders via the `package.json` script:
```json
"generate": "generate-builders <full-or-relative-path-to-ts-file> <full-or-relative-path-to-output-directory>"
```

Generating builders from code:
```typescript
import {generateBuilders} from 'typescript-factory-foundry'

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

export type SimpleExample = {
  prop1: Scalars['Boolean'];
  prop2: number;
  prop3: {
    innerProp: string;
  };
  prop4: NestTypeExample;
};

export type NestTypeExample = {
  nestedProp: string;
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
│   ├── SimpleExampleBuilder.ts
│   └── NestTypeExampleBuilder.ts
└── ...
```

Which will look like this:
```typescript
//index.ts
export * from './ScalarsBuilder';
export * from './SimpleExampleBuilder';
export * from './NestTypeExampleBuilder';

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

export type SimpleExample = {
  prop1: Scalars['Boolean'];
  prop2: number;
  prop3: {
    innerProp: string;
  };
  prop4: NestTypeExample;
};

export type NestTypeExample = {
  nestedProp: string;
}

// ScalarsBuilder.ts
/* eslint-disable */
import { DeepPartial } from 'ts-essentials';
import * as SchemaTypes from './simpleTypes';

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
    return Object.assign({}, this.obj) as SchemaTypes.Scalars;
  }
}

export function aScalarsBuilder<O extends DeepPartial<SchemaTypes.Scalars> = {}>(baseObj?: O): ScalarsBuilder {
  return new ScalarsBuilder(baseObj ?? {});
}

// SimpleExampleBuilder.ts
/* eslint-disable */
import { DeepPartial } from 'ts-essentials';
import * as SchemaTypes from './simpleTypes';

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

  public withProp4<P extends DeepPartial<SchemaTypes.NestTypeExample>>(val: P): SimpleExampleBuilder {
    this.obj.prop4 = val;
    return this;
  }

  public includeTypename() {
    // @ts-ignore
    this.obj.__typename = 'SimpleExample';
    return this;
  }

  public get(): SchemaTypes.SimpleExample {
    return Object.assign({}, this.obj) as SchemaTypes.SimpleExample;
  }
}

export function aSimpleExampleBuilder<O extends DeepPartial<SchemaTypes.SimpleExample> = {}>(baseObj?: O): SimpleExampleBuilder {
  return new SimpleExampleBuilder(baseObj ?? {});
}

// NestTypeExampleBuilder.ts
/* eslint-disable */
import { DeepPartial } from 'ts-essentials';
import * as SchemaTypes from './simpleTypes';

export class NestTypeExampleBuilder {
  constructor(private readonly obj = {} as DeepPartial<SchemaTypes.NestTypeExample>) {
  }

  public withNestedProp<P extends string>(val: P): NestTypeExampleBuilder {
    this.obj.nestedProp = val;
    return this;
  }

  public includeTypename() {
    // @ts-ignore
    this.obj.__typename = 'NestTypeExample';
    return this;
  }

  public get(): SchemaTypes.NestTypeExample {
    return Object.assign({}, this.obj) as SchemaTypes.NestTypeExample;
  }
}

export function aNestTypeExampleBuilder<O extends DeepPartial<SchemaTypes.NestTypeExample> = {}>(baseObj?: O): NestTypeExampleBuilder {
  return new NestTypeExampleBuilder(baseObj ?? {});
}
```

## How to use builders:
First use the builder function to initialize a builder:
```typescript
const builder = aSimpleExampleBuilder();
```

Then add the properties you want:
```typescript
builder.withProp1(true);
builder.withProp2(15).withProp3({innerProp: 'inner prop'});
builder.withProp4(aNestedTypeExampleBuilder().withNestedProp('nested prop').get());
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
const builder = aSimpleExampleBuilder();

builder.withProp1(true);
builder.withProp2(15).withProp3({innerProp: 'inner prop'});
builder.withProp4(aNestedTypeExampleBuilder().withNestedProp('nested prop').get());

// item with all the initially defined props
const item1 = builder.get();
builder.withProp4(aNestedTypeExampleBuilder().withNestedProp('nested prop').get());

// update builder
builder.withProp4(aNestedTypeExampleBuilder().withNestedProp('a whole new value').get());

// item with all the initially defined props and the overridden prop4
const item2 = builder.get();
```
