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

// Type definition for a type-level object
// to track the current state of our computation
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

// nextState = { ...oldState, codePtr: oldState.codePTr + 1 }
type Next<S extends State> = {
  codePtr: Inc<S["codePtr"]>;
} & Omit<S, "codePtr">;

// nextState = { ...next(state), tape: incAt(state.tape, state.dataPtr) }
type Increment<S extends State> = {
  tape: IncAt<S["tape"], S["dataPtr"]>;
} & Omit<Next<S>, "tape">;

// nextState = { ...next(state), tape: decAt(state.tape, state.dataPtr) }
type Decrement<S extends State> = {
  tape: DecAt<S["tape"], S["dataPtr"]>;
} & Omit<Next<S>, "tape">;

// nextState = { ...next(state), dataPtr: state.dataPtr + 1 }
type MoveRight<S extends State> = {
  dataPtr: Inc<S["dataPtr"]>;
} & Omit<Next<S>, "dataPtr">;

// nextState = { ...next(state), dataPtr: state.dataPtr - 1 }
type MoveLeft<S extends State> = {
  dataPtr: Dec<S["dataPtr"]>;
} & Omit<Next<S>, "dataPtr">;

// nextState = { ...next(state), output: state.output + state.tape[state.dataPtr] }
type Print<S extends State> = {
  tape: S["tape"];
  dataPtr: S["dataPtr"];
  output: `${S["output"]}${S["tape"][S["dataPtr"]]}`;
  loopStack: S["loopStack"];
  codePtr: Inc<S["codePtr"]>;
};

// nextState = { ...next(state), codePtr: state.codePtr + 1, loopStack: [state.codePtr, ...state.loopStack]
type StartLoop<S extends State> = {
  tape: S["tape"];
  dataPtr: S["dataPtr"];
  output: S["output"];
  codePtr: Inc<S["codePtr"]>;
  loopStack: [S["codePtr"], ...S["loopStack"]];
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
  Code extends `+${infer Rest}` ? _Interpret<Rest, Increment<S>, FullCode> : 
  Code extends `-${infer Rest}` ? _Interpret<Rest, Decrement<S>, FullCode> :
  Code extends `>${infer Rest}` ? _Interpret<Rest, MoveRight<S>, FullCode> :
  // @ts-ignore: The TS compiler will complain about excessive stack depth
  // when evaluating the "MoveLeft" type level function, but we can get it
  // to work anyway with the ts-ignore directive.
  Code extends `<${infer Rest}` ? _Interpret<Rest, MoveLeft<S>, FullCode>  :
  Code extends `.${infer Rest}` ? _Interpret<Rest, Print<S>, FullCode>     :
  Code extends `[${infer Rest}` ? _Interpret<Rest, StartLoop<S>, FullCode> :
  Code extends `]${infer Rest}` ?
    // if tape[dataPtr] == 0
    S["tape"][S["dataPtr"]] extends 0 
        // state.loopStack.pop();
        // return interpret(rest, next(state))
      ? _Interpret<Rest,
                   Omit<Next<S>, "loopStack"> & { loopStack: Tail<S["loopStack"]> },
                   FullCode>
      // oldPtr = loopStack[0]
      // if (typeof oldPtr === "number")
      : Head<S["loopStack"]> extends infer OldPtr extends number
        // code = fullCode.substring(oldPtr, fullCode.length)
        // state.codePtr = oldPtr + 1
        // return interpret(code, state)
        ? _Interpret<StrSplice<FullCode, OldPtr>,
                           Omit<S, "codePtr"> & { codePtr: Inc<OldPtr> },
                           FullCode>
        // else return new Error("Encountered an error")
        : "Encountered an error"

  : S;
  

// Get the 'tape' and 'output' fields from a State type
export type GetResult<S extends State> = {
  tape: S["tape"],
  output: S["output"]
}

// Start with the memory tape initialized to [tape], and
// Interpret the BrainFuck program [Code].
export type Interpret<
  Code extends string,
  tape extends Tape = ZeroedTape
> = GetResult<
 _Interpret<
  Code,
  { tape: tape; dataPtr: 0; output: ""; loopStack: []; codePtr: 0 }
> >;

export type _$ = Interpret<">[-<+>]", [40, 50, 0]>;

