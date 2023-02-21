import { AsNum, Dec, Inc } from "./arith";
import { Head, SplitAt, Tail } from "./util";

type Tape = [number, number, number];
type ZeroedTape = [0, 0, 0];

type IncAt<_Tape extends Tape, Index extends number> = SplitAt<
  _Tape,
  Index
> extends [infer L, infer R]
  ? L extends number[]
    ? R extends number[]
      ? [...L, Inc<AsNum<Head<R>>>, ...Tail<R>]
      : ZeroedTape
    : ZeroedTape
  : ZeroedTape;

type DecAt<_Tape extends Tape, Index extends number> = SplitAt<
  _Tape,
  Index
> extends [infer L, infer R]
  ? L extends number[]
    ? R extends number[]
      ? [...L, Dec<AsNum<Head<R>>>, ...Tail<R>]
      : ZeroedTape
    : ZeroedTape
  : ZeroedTape;

type Instruction = "+" | "-" | ">" | "<" | "[" | "]" | ".";

type State = {
  // The memory tape
  tape: Tape;

  // An index into the memory tape
  dataPtr: number;

  // An index into the source code.
  // This always points to the current instruction
  // being executed.
  codePtr: number;

  // Anything printed by the "." command is appended here.
  output: string;

  // To keep track of nested loops.
  loopStack: number[];
};

type Next<S extends State> = {
  codePtr: Inc<S["codePtr"]>;
} & Omit<S, "codePtr">;

type Increment<S extends State> = {
  tape: IncAt<S["tape"], S["dataPtr"]>;
} & Omit<Next<S>, "tape">;

type Decrement<S extends State> = {
  tape: DecAt<S["tape"], S["dataPtr"]>;
} & Omit<Next<S>, "tape">;

type MoveRight<S extends State> = {
  dataPtr: Inc<S["dataPtr"]>;
} & Omit<Next<S>, "dataPtr">;

type MoveLeft<S extends State> = {
  dataPtr: Dec<S["dataPtr"]>;
} & Omit<Next<S>, "dataPtr">;

type Print<S extends State> = {
  tape: S["tape"];
  dataPtr: S["dataPtr"];
  output: `${S["output"]}${S["tape"][S["dataPtr"]]}`;
  loopStack: S["loopStack"];
  codePtr: Inc<S["codePtr"]>;
};

type StartLoop<S extends State> = {
  tape: S["tape"];
  dataPtr: S["dataPtr"];
  output: S["output"];
  codePtr: Inc<S["codePtr"]>;
  loopStack: [S["codePtr"], ...S["loopStack"]];
};

type ReadTape<S extends State> = S["tape"][S["dataPtr"]];

type EndLoop<S extends State> = {
  tape: S["tape"];
  dataPtr: S["dataPtr"];
  output: S["output"];
  codePtr: ReadTape<S> extends 0 
      ? Inc<S["codePtr"]>
      : Head<S["loopStack"]>;
  loopStack: ReadTape<S> extends 0
    ? Tail<S["loopStack"]>
    : S["loopStack"];
};

// prettier-ignore
export type Step<S extends State, Instr extends Instruction> = 
  Instr extends "+" ? Increment<S> :
  Instr extends "-" ? Decrement<S> :
  Instr extends ">" ? MoveRight<S> :
  Instr extends "<" ? MoveLeft<S>  :
  Instr extends "." ? Print<S>     :
  Instr extends "[" ? StartLoop<S> : 
  Instr extends "]" ? EndLoop<S>   : 
  Next<S>;

type StartState = {
  tape: [0, 0, 0];
  dataPtr: 0;
  output: "";
  codePtr: 0;
  loopStack: [];
};

type StrSplice<Str extends string,
  Index extends number,
  CurrIndex extends number = 0> =
  Str extends `${infer _Char}${infer Rest}`
  ? CurrIndex extends Index
    ? Rest 
    : StrSplice<Rest, Index, Inc<CurrIndex>>
  : "";

type Interpret2<
  Code extends string,
  S extends State = StartState,
  FullCode extends string = Code
> =
  Code extends `+${infer Rest}` ? Interpret2<Rest, Increment<S>> : 
  Code extends `-${infer Rest}` ? Interpret2<Rest, Decrement<S>> :
  Code extends `>${infer Rest}` ? Interpret2<Rest, MoveRight<S>> :
  Code extends `<${infer Rest}` ? Interpret2<Rest, MoveRight<S>> :
  Code extends `.${infer Rest}` ? Interpret2<Rest, Print<S>>     :
  Code extends `[${infer Rest}` ? Interpret2<Rest, StartLoop<S>> :
  Code extends `]${infer Rest}` ? 
    S["dataPtr"] extends 0 
      ? Head<S["loopStack"]> extends infer OldPtr extends number
         ? Interpret2<StrSplice<FullCode, OldPtr>, Omit<S, "codePtr"> & { codePtr: Inc<OldPtr> }>
         : "Encountered an error"

      : Interpret2<Rest, Omit<Next<S>, "loopStack"> & { loopStack: Tail<S["loopStack"]> }> 
  : S;

export type Interpret<
  Code extends string,
  tape extends Tape = ZeroedTape
> = Interpret2<
  Code,
  { tape: tape; dataPtr: 0; output: ""; loopStack: []; codePtr: 0 }
>;

export type _$ = Interpret<"+++++++.>+++.[-].">;

