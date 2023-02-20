import { AsNum, Dec, Inc } from './arith'
import { Equals, Head, If, SplitAt, Tail, TupLen } from './util'

type StrIsEmpty<S extends string> =
  S extends `${infer _S0}`
  ? If<Equals<_S0, ''>, true, false>
  : true 

type StrLen<Str extends string, Acc extends unknown[] = []> =
  TupLen<Str extends `${infer _S0}${infer SRest}`
  ? StrLen<SRest, [...Acc, 0]>
  : []>

type Tape = [number, number, number];

type State = {
  tape: Tape,
  ptr: number
}

export type IncAt<_Tape extends Tape, Index extends number> = 
  SplitAt<_Tape, Index> extends [infer L, infer R]
  ?  L extends number[]
     ? R extends number[]
       ? [...L, Inc<AsNum<Head<R>>>,...Tail<R>]
     : 0
     : 0
  : 0;

export type DecAt<_Tape extends Tape, Index extends number> = 
  SplitAt<_Tape, Index> extends [infer L, infer R]
  ?  L extends number[]
     ? R extends number[]
       ? [...L, Dec<AsNum<Head<R>>>,...Tail<R>]
     : 0
     : 0
  : 0;


type t2 = IncAt<[0, 2, 1], 1>
type t3 = SplitAt<[1, 2], 1> extends [infer L, infer R]
  ? L extends number[] ? 
    R extends number[] ? [...L, Inc<AsNum<Head<R>>> ,...Tail<R>] : 0 :0
  : 0


type Instruction = 
  | '+'
  | '-'
  | '>'
  | '<'
  | '['
  | ']'


export type Increment<S extends State> =
  {
    tape: IncAt<S["tape"], S["ptr"]>,
    ptr: S["ptr"]
  }

export type MoveRight<S extends State> = {
     tape: S["tape"],
     ptr: Inc<S["ptr"]>
}

export type MoveLeft<S extends State> = {
     tape: S["tape"],
     ptr: Dec<S["ptr"]>
}

export type Decrement<S extends State> = {
  tape: DecAt<S["tape"], S["ptr"]>,
  ptr: S["ptr"]
}

export type Eval<S extends State, Instr extends Instruction> =
  Instr extends '+' ? Increment<S> :
  Instr extends '-' ? Decrement<S> :
  Instr extends '>' ? MoveRight<S> :
  Instr extends '<' ? MoveLeft<S> :
  never;


type nextstate = Eval<{ tape: [2, 0, 0], ptr: 0 }, '-'>

