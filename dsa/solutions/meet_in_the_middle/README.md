# Meet-in-the-Middle

This section contains solutions implemented in C++ STL for classic meet-in-the-middle problems from LeetCode. Each solution file starts with the full problem statement header, link, approach, and complexity.

## Problems

1) 1755. Closest Subsequence Sum
- LeetCode: https://leetcode.com/problems/closest-subsequence-sum/
- Solution: solutions/meet_in_the_middle/1755_closest_subsequence_sum.cpp
- Approach:
  - Split the array into two halves.
  - Enumerate all subset sums in each half (2^(n/2)).
  - Sort one side and binary search the best complement for each sum from the other side to minimize |sum - goal|.
  - Complexity: O(2^(n/2)) time and space.
  - Notes: The implementation avoids structured bindings and uses a portable abs helper for long long.

2) 0805. Split Array With Same Average
- LeetCode: https://leetcode.com/problems/split-array-with-same-average/
- Solution: solutions/meet_in_the_middle/0805_split_array_with_same_average.cpp
- Approach:
  - Average equality condition reduces to finding a non-empty proper subset of the transformed array a[i] = nums[i] * n - S that sums to 0.
  - Split into halves and enumerate subset sums grouped by cardinality.
  - Check zero-sum within one half or by matching sumL + sumR == 0 with size constraints (1..n-1).
  - Complexity: O(2^(n/2) * n) time, O(2^(n/2)) space.

## File Index

- 1755: solutions/meet_in_the_middle/1755_closest_subsequence_sum.cpp
- 0805: solutions/meet_in_the_middle/0805_split_array_with_same_average.cpp

## Notes

- The C++ solutions follow LeetCode function signatures and rely on standard STL containers and algorithms.
- If your editor flags false errors about std::vector or iterators, it is a tooling issue. The code remains standard-compliant and accepted on LeetCode.