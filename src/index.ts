import { AsNum, Dec, Inc } from "./arith";
import { Head, SplitAt, Tail } from "./util";

type Tape = [number, number, number];
type ZeroedTape = [0, 0, 0];

type State = {
  tape: Tape;
  ptr: number;
  output: string;
};

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

type Increment<S extends State> = {
  tape: IncAt<S["tape"], S["ptr"]>;
  ptr: S["ptr"];
  output: S["output"];
};

type MoveRight<S extends State> = {
  tape: S["tape"];
  ptr: Inc<S["ptr"]>;
  output: S["output"];
};

type MoveLeft<S extends State> = {
  tape: S["tape"];
  ptr: Dec<S["ptr"]>;
  output: S["output"];
};

type Decrement<S extends State> = {
  tape: DecAt<S["tape"], S["ptr"]>;
  ptr: S["ptr"];
  output: S["output"];
};

type Log<S extends State> = {
  tape: DecAt<S["tape"], S["ptr"]>;
  ptr: S["ptr"];
  output: `${S["output"]}${S["tape"][S["ptr"]]}`;
}

export type Step<S extends State, Instr extends Instruction> =
  Instr extends "+" ? Increment<S> :
  Instr extends "-" ? Decrement<S> :
  Instr extends ">" ? MoveRight<S> :
  Instr extends "." ? Log<S>       :
  Instr extends "<" ? MoveLeft<S>  : S;

type StartState = {
  tape: [0, 0, 0],
  ptr: 0,
  output: ''
}

export type Interpret<Code extends string, S extends State = StartState> =
  Code extends `${infer Instr extends Instruction}${infer Rest extends string}`
  // @ts-ignore: TS thinks this call is "possibly infinite". But I'll just ignore this :^)
  ? Interpret<Rest, Step<S, Instr>>
  : S;

export type _$ = Interpret<"++++++.">

