[![asciicast](docs/gifs/demo.cast)](docs/gifs/demo.cast)

# Typescript Factory Foundry
This project allows you to generate definitely typed builders based on typescript `interface` and `type`.

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

## Additional Info
You can find more explanation about how the library can be used and what kind of problems it can solve [here](./docs/DETAILED_INFO.md)
