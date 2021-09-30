export interface SimpleExample {
  prop1: boolean;
  prop2: number;
  prop3: {
    innerProp: string;
  };
}

export type unionType =
  | { prop1: number; shared: string }
  | { example: string; shared: string };
