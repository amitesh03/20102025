# Sliding Window (Contiguous subarray/substring optimization)

Focus: Maintain a window [l..r] and adjust boundaries to optimize sum/length/count conditions in O(n).

Covered problems (from syllabus and extras):
- 3 Longest Substring Without Repeating Characters
- 76 Minimum Window Substring
- 159 Longest Substring with At Most Two Distinct Characters
- 438 Find All Anagrams in a String
- 209 Minimum Size Subarray Sum
- 2958 Length of Longest Subarray With at Most K Frequency
- 1004 Max Consecutive Ones III

Implemented:
- 209 Minimum Size Subarray Sum
  - File: solutions/sliding_window/0209_minimum_size_subarray_sum.cpp
  - Technique: Expand on r, shrink on l while maintaining sum ≥ target to minimize window length.
  - Complexity: O(n) time, O(1) extra space.

Planned (to be added):
- 3 Longest Substring Without Repeating Characters
- 76 Minimum Window Substring
- 159 Longest Substring with At Most Two Distinct Characters
- 438 Find All Anagrams in a String
- 2958 Length of Longest Subarray With at Most K Frequency
- 1004 Max Consecutive Ones III

Notes:
- All solutions use C++ STL (vector, string, unordered_map/unordered_set, deque where applicable).
- Top-of-file comments include problem statement summary and constraints per repository convention.
- VS Code IntelliSense may show false errors on STL methods; code targets standard LeetCode toolchains.