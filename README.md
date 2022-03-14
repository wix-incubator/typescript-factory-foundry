# Typescript Factory Foundry
<p align="center">
  <img src="https://github.com/wix-incubator/typescript-builders-generator/blob/master/docs/img/logo.png" width="300" />
</p>
<p align="center" font-weight="bold">
  Generate definitely typed builders based on typescript <code> interface</code> and <code>type</code>.
</p>
<p align="center" style="font-weight: 600;">
  ☝ For more examples check <a href="https://github.com/wix-incubator/typescript-builders-generator/blob/master/docs/DETAILED_INFO.md">this<a/> readme file.
</p>


## Install
Install using `npm` or `yarn`:
```bash
npm i --save-dev typescript-factory-foundry
```

## Getting Started
Create a simple `typescript` file (e.g. `myTypes.ts`) with `interfaces/types`:
```typescript
export interface SimpleInterface {
  prop1: string;
  prop2: number;
  prop3: {
    innerProp: string;
  };
}
```

run the command:
```bash
npx typescript-factory-foundry ./src/myTypes.ts ./src/generated
```

and use the generated builders:
```typescript
import {aSimpleInterfaceBuilder} from './generated';

const builder = aSimpleInterfaceBuilder().withProp1('my prop').withProp3({innerProp: 'an inner prop'});

// item contains the data we defined in the builder
const item = builder.get();
```

## Additional Options

| **Code**           | **Command Line**        | **Description**                                             |
|--------------------|-------------------------|-------------------------------------------------------------|
| useNullInitializer | -n, --use-default-nulls | use null as default value in builder properties initializer |

## Additional Info
[Here](https://github.com/wix-incubator/typescript-builders-generator/blob/master/docs/DETAILED_INFO.md) you can find a more in-depth explanation of how the library can be used and what kind of problems it can solve.
