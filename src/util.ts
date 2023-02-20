import {Add} from "./arith";

export type TupLen<A extends unknown[]> = A["length"] extends number ?
  A["length"]
  : -1

export type N<Value extends number> = MkTup<Value>

export type MkTup<N extends number, A extends unknown[] = []> = TupLen<A> extends N
  ? A
  : MkTup<N, [...A, 0]>;


export type If<Cond, Then, Else> =
    Cond extends true ? Then : Else;

export type Equals<T1, T2> =
  T1 extends T2
  ? true
  : false;

export type Tail<List extends unknown[]> =
  List extends [infer _Head, ...infer LRest]
  ? LRest
  : [];

 
export type Head<List extends unknown[]> =
  List extends [infer Head, ...infer _LRest]
  ? Head 
  : [];


type Numeric<M> = M extends number ? M : 0;

export type SplitAt<
  List extends unknown[],
  Index extends number,
  CurrIndex extends number = 0,
  Acc extends unknown[] = []> =
    Index extends CurrIndex
    ? [Acc, List]
    : SplitAt<
      Tail<List>,
      Index,
      Numeric<Add<CurrIndex, 1>>,
      [...Acc, Head<List>]
    > 

