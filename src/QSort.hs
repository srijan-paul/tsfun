qsort :: (Ord a, Eq a) => [a] -> [a]
qsort (p:xs) =
  let left =  [ x | x <- xs, x <= p ]
      right = [ x | x <- xs, x >  p ]
  in qsort left ++ [p] ++ qsort right

qsort [] = []

main = print $ show $ qsort [3, 4, 1, 5]

