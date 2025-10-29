# Monotonic Queue / Deque

Focus: Maintain a deque where values are strictly increasing or decreasing to answer window max/min and feasibility checks in linear time.

Core patterns:
- Sliding Window Maximum: keep a decreasing deque of indices; pop front when it leaves window.
- Shortest Subarray with Sum ≥ K: use prefix sums with an increasing deque of indices (pop front when constraint satisfied; pop back to maintain monotonicity).
- Longest Continuous Subarray With Absolute Diff ≤ K: maintain two deques (max and min) to track window extremes.

Covered (from syllabus and extras):
- 239 Sliding Window Maximum
- 862 Shortest Subarray with Sum at Least K
- 1438 Longest Continuous Subarray With Absolute Diff ≤ K

Implemented:
- 862 Shortest Subarray with Sum at Least K
  - File: solutions/monotonic_queue/0862_shortest_subarray_with_sum_at_least_k.cpp
  - Technique: Prefix sums + increasing deque of indices; each index pushed/popped at most once.
  - Complexity: O(n) time, O(n) space.

Planned (to be added):
- 239 Sliding Window Maximum
- 1438 Longest Continuous Subarray With Absolute Diff ≤ K

Notes:
- All solutions use C++ STL (vector, deque) with top-of-file comments summarizing the problem and constraints.
- Some editors may report false errors on STL methods; code targets standard LeetCode compilers/toolchains.