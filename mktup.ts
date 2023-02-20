function MkTup(N: number, A: number[] = []): number[] {
  return A.length === N
      ? A
      : MkTup(N, [...A, 0]);
}

console.log(MkTup(12));

