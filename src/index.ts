import { AsNum, Dec, Inc } from "./arith";
import { Head, SplitAt, Tail } from "./util";

type Tape = [number, number, number];

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
      : 0
    : 0
  : 0;

type DecAt<_Tape extends Tape, Index extends number> = SplitAt<
  _Tape,
  Index
> extends [infer L, infer R]
  ? L extends number[]
    ? R extends number[]
      ? [...L, Dec<AsNum<Head<R>>>, ...Tail<R>]
      : 0
    : 0
  : 0;

type Instruction = "+" | "-" | ">" | "<" | "[" | "]";

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

export type Eval<S extends State, Instr extends Instruction> =
  Instr extends "+" ? Increment<S> :
  Instr extends "-" ? Decrement<S> :
  Instr extends ">" ? MoveRight<S> :
  Instr extends "." ? Log<S>       :
  Instr extends "<" ? MoveLeft<S>  : never;

type nextstate = Eval<{ tape: [2, 0, 0]; ptr: 0; output: "" }, "-">;

