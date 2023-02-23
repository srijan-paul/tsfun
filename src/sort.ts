import { Gt } from "./arith";

export type Partition<
  Xs extends number[],
  Pivot extends number,
  LR extends [number[], number[]] = [[], []]
> = Xs extends [infer X extends number, ...infer Rest extends number[]]
  ? Gt<X, Pivot> extends true
    ? Partition<Rest, Pivot, [LR[0], [X, ...LR[1]]]>
    : Partition<Rest, Pivot, [[X, ...LR[0]], LR[1]]>
  : LR;

export type QSort<Xs extends number[]> = Xs extends [
  infer Pivot extends number,
  ...infer Rest extends number[]
]
  ? Partition<Rest, Pivot> extends [
      infer L extends number[],
      infer R extends number[]
    ]
    ? [...QSort<L>, Pivot, ...QSort<R>]
    : Xs
  : Xs;

