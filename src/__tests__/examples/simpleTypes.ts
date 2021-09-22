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
};
