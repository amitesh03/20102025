# Two Pointers (Opposite-ends and same-direction techniques)

Focus: Use two indices to scan from both ends or in the same direction to reduce complexity for sorted arrays/strings and palindrome checks.

Common applications:
- Opposite ends: find pair sums, container area, palindrome validation.
- Same direction: deduplication on sorted arrays, merging arrays.

Covered (from syllabus):
- 15 3Sum
- 18 4Sum
- 26 Remove Duplicates from Sorted Array
- 88 Merge Sorted Array
- 680 Valid Palindrome II
- 167 Two Sum II - Input array is sorted
- 125 Valid Palindrome

Implemented:
- 167 Two Sum II - Input array is sorted
  - File: solutions/two_pointers/0167_two_sum_ii_input_array_is_sorted.cpp
  - Technique: Opposite-ends pointers (l, r) on sorted array; adjust toward target.
  - Complexity: O(n) time, O(1) space.

Planned (to be added):
- 26 Remove Duplicates from Sorted Array
- 88 Merge Sorted Array
- 680 Valid Palindrome II
- 125 Valid Palindrome
- 15 3Sum
- 18 4Sum

Notes:
- All solutions use C++ STL (vector, string, etc.) and start with a problem header comment including constraints and approach.
- Editor IntelliSense errors on STL may appear in this environment; code targets standard LeetCode toolchains.