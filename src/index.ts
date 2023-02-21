import { AsNum, Dec, Inc } from "./arith";
import { Head, SplitAt, Tail } from "./util";

type Tape = [number, number, number];
type ZeroedTape = [0, 0, 0];


// Increment the value at [Index] in [_Tape] by 1.
// Algorithm:
// Say the tape is [1, 2, 3], and we want to increment index 1.
// First, we split the tape into two parts like so:
// [[1], [2, 3]. Say L = [1], R = [2, 3]
// Then, we take take concatenate: L + [Head(R) + 1] + Rest(R)
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


// Decrement the value at [Index] in [_Tape] by 1.
// Works just like "Increment".
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

type _Interpret<
  Code extends string,
  S extends State = StartState,
  FullCode extends string = Code
> =
  Code extends `+${infer Rest}` ? _Interpret<Rest, Increment<S>> : 
  Code extends `-${infer Rest}` ? _Interpret<Rest, Decrement<S>> :
  Code extends `>${infer Rest}` ? _Interpret<Rest, MoveRight<S>> :
  // @ts-ignore: The TS compiler will complain about excessive stack depth
  // when evaluating the "MoveLeft" type level function, but we can get it
  // to work anyway with the ts-ignore directive.
  Code extends `<${infer Rest}` ? _Interpret<Rest, MoveLeft<S>>  :
  Code extends `.${infer Rest}` ? _Interpret<Rest, Print<S>>     :
  Code extends `[${infer Rest}` ? _Interpret<Rest, StartLoop<S>> :
  Code extends `]${infer Rest}` ? 
    S["tape"][S["dataPtr"]] extends 0 
      ? Head<S["loopStack"]> extends infer OldPtr extends number
         ? _Interpret<StrSplice<FullCode, OldPtr>,
                      Omit<S, "codePtr"> & { codePtr: Inc<OldPtr> },
                      FullCode>
         : "Encountered an error"

      : _Interpret<Rest,
                   Omit<Next<S>, "loopStack"> & { loopStack: Tail<S["loopStack"]> },
                   FullCode> 
  : S;

// Start with the memory tape initialized to [tape], and
// Interpret the BrainFuck program [Code].
export type Interpret<
  Code extends string,
  tape extends Tape = ZeroedTape
> = _Interpret<
  Code,
  { tape: tape; dataPtr: 0; output: ""; loopStack: []; codePtr: 0 }
>;

export type __$ = Interpret<"++[">
export type _$ = Interpret<"++[-].">["tape"];


