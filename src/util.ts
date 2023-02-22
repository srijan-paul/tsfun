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



export type AsciiMap = [
  '\x00', '\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07', '\b',   '\t',
  '\n',   '\x0B', '\f',   '\r',   '\x0E', '\x0F', '\x10', '\x11', '\x12', '\x13',
  '\x14', '\x15', '\x16', '\x17', '\x18', '\x19', '\x1A', '\x1B', '\x1C', '\x1D',
  '\x1E', '\x1F', ' ',    '!',    '"',    '#',    '$',    '%',    '&',    "'",
  '(',    ')',    '*',    '+',    ',',    '-',    '.',    '/',    '0',    '1',
  '2',    '3',    '4',    '5',    '6',    '7',    '8',    '9',    ':',    ';',
  '<',    '=',    '>',    '?',    '@',    'A',    'B',    'C',    'D',    'E',
  'F',    'G',    'H',    'I',    'J',    'K',    'L',    'M',    'N',    'O',
  'P',    'Q',    'R',    'S',    'T',    'U',    'V',    'W',    'X',    'Y',
  'Z',    '[',    '\\',   ']',    '^',    '_',    '`',    'a',    'b',    'c',
  'd',    'e',    'f',    'g',    'h',    'i',    'j',    'k',    'l',    'm',
  'n',    'o',    'p',    'q',    'r',    's',    't',    'u',    'v',    'w',
  'x',    'y',    'z',    '{',    '|',    '}',    '~',    '\x7F', '\x80', '\x81',
  '\x82', '\x83', '\x84', '\x85', '\x86', '\x87', '\x88', '\x89', '\x8A', '\x8B',
  '\x8C', '\x8D', '\x8E', '\x8F', '\x90', '\x91', '\x92', '\x93', '\x94', '\x95',
  '\x96', '\x97', '\x98', '\x99', '\x9A', '\x9B', '\x9C', '\x9D', '\x9E', '\x9F',
  ' ',    '¡',    '¢',    '£',    '¤',    '¥',    '¦',    '§',    '¨',    '©',
  'ª',    '«',    '¬',    '­',    '®',    '¯',    '°',    '±',    '²',    '³',
  '´',    'µ',    '¶',    '·',    '¸',    '¹',    'º',    '»',    '¼',    '½',
  '¾',    '¿',    'À',    'Á',    'Â',    'Ã',    'Ä',    'Å',    'Æ',    'Ç',
  'È',    'É',    'Ê',    'Ë',    'Ì',    'Í',    'Î',    'Ï',    'Ð',    'Ñ',
  'Ò',    'Ó',    'Ô',    'Õ',    'Ö',    '×',    'Ø',    'Ù',    'Ú',    'Û',
  'Ü',    'Ý',    'Þ',    'ß',    'à',    'á',    'â',    'ã',    'ä',    'å',
  'æ',    'ç',    'è',    'é',    'ê',    'ë',    'ì',    'í',    'î',    'ï',
  'ð',    'ñ',    'ò',    'ó',    'ô',    'õ',    'ö',    '÷',    'ø',    'ù',
  'ú',    'û',    'ü',    'ý',    'þ',    'ÿ'
]


