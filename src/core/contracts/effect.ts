export type Effect =
  | { type: "setFlag"; key: string; value: boolean }
  | { type: "setVariable"; key: string; value: string | number }
  | { type: "changeMoney"; amount: number }
  | { type: "advanceTime"; hours?: number; days?: number }
  | {
      type: "mutateCharacterNumericAttribute";
      characterId: string;
      semanticKey: string;
      operation: "set" | "add" | "subtract";
      value: number;
    }
  | {
      type: "mutateCharacterNumericProperty";
      characterId: string;
      propertyId: string;
      operation: "set" | "add" | "subtract";
      value: number;
    };
