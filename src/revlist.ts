export type Reverse<A extends unknown[]> =
  A extends [infer A0, ...infer Rest]
  ? [...Reverse<Rest>, A0]
  : [];

