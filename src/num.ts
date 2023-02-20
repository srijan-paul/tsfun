type DigitToTup<T extends unknown[] = [unknown]> = {
  '0' : [],
  '1': T,
  '2': [...T, ...T],
  '3': [...T, ...T, ...T],
  '4': [...T, ...T, ...T, ...T],
  '5': [...T, ...T, ...T, ...T, ...T],
  '6': [...T, ...T, ...T, ...T, ...T, ...T],
  '7': [...T, ...T, ...T, ...T, ...T, ...T, ...T],
  '8': [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T],
  '9': [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T],
  '10': [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T],
};


type Append<s1 extends string,
            s2 extends string> = `${s1}${s2}`;

type Digit = '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9';

type BuildTuple_<N extends string, Result extends unknown[]>
  = N extends Append<Digit & infer D, infer Rest>
    ? BuildTuple_<Rest, [...DigitToTup[Digit & D], ...DigitToTup<Result>['10']]>
    : Result;

type BuildTuple<N extends string> = BuildTuple_<N, []>;

type TLen<T extends unknown[]> = T extends { length: infer L }
 ? L
 : void;

type ToNum<s extends string> = TLen<BuildTuple<s>>

type UnTup<A, B> = [A, B] | [B, A]

