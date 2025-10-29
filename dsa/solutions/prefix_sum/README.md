# Prefix Sum (Cumulative sums for subarray queries)

Focus: Maintain running sum S[i] = sum(nums[0..i-1]) to transform subarray sums into differences S[j] - S[i].

Core patterns:
- Hash map of remainders or sums to count/locate subarrays efficiently.
- 2D prefix sums and set/multiset for matrix variants (e.g., 363).
- Prefix/postfix arrays for multiplicative transforms (e.g., 238).

Covered problems (from syllabus and extras):
- 560 Subarray Sum Equals K
- 1248 Count Number of Nice Subarrays
- 523 Continuous Subarray Sum
- 238 Product of Array Except Self (prefix/postfix trick)
- 363 Max Sum of Rectangle No Larger Than K

Implemented:
- 523 Continuous Subarray Sum
  - File: solutions/prefix_sum/0523_continuous_subarray_sum.cpp
  - Technique: prefix sum modulo (k != 0), consecutive zeros check for k == 0.
  - Complexity: O(n) time, O(n) space for remainder map.

Planned (to be added):
- 560 Subarray Sum Equals K
- 1248 Count Number of Nice Subarrays
- 238 Product of Array Except Self (prefix/postfix arrays variant)
- 363 Max Sum of Rectangle No Larger Than K (optimize via Kadane over compressed columns)

Notes:
- All solutions use C++ STL (vector, unordered_map, etc.).
- Editor IntelliSense may show false STL errors; target standard LeetCode toolchains.