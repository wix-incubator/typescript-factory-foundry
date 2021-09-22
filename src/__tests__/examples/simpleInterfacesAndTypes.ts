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

export type NestedTypeExample = {
  nestedProp1: SimpleExample;
  nestedProp2: {
    simple: SimpleExample;
  };
  scalar1: Scalars;
};
