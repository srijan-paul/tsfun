import type { TupLen, N } from './util'

export type Add<A extends number, B extends number> = TupLen<
  [...N<A>, ...N<B>]
>;

type Sub_<A extends unknown[], B extends unknown[]> =
  A extends [...infer A1, 0]
    ? B extends [...infer B1, 0]
      ? Sub_<A1, B1>
      : A
    : A

export type Sub<A extends number, B extends number> =
    TupLen<Sub_<N<A>, N<B>>>

export type Gt_<A extends unknown[], B extends unknown[]> =
  A extends [0, ...infer RestA]
    ? B extends [0, ...infer RestB]
      ? Gt_<RestA, RestB>
      : true
    : false;

export type Gt<A extends number, B extends number> = Gt_<N<A>, N<B>>;

export type AsNum<M> = M extends number ? M : 0;
export type Inc<A extends number> = AsNum<Add<A, 1>>
export type Dec<A extends number> = AsNum<Sub<A, 1>>

