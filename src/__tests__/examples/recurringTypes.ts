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

export interface UnionTypeExample {
  prop1: string | number;
  prop2: string | SimpleExample;
  prop3: SimpleExample | Scalars;
}

export interface RecurringTypesExample {
  prop1: SimpleExample;
  prop2: SimpleExample;
  prop3: UnionTypeExample;
}

export interface ArrayExample {
  prop1: SimpleExample[];
  prop2: number[];
}
