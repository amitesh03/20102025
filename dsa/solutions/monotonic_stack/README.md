# Monotonic Stack

Focus: Use a stack that is strictly increasing or decreasing to answer next greater/smaller element, ranges, and greedy removals in linear time.

Core patterns:
- Next Greater Element (scan once, pop while current breaks monotonicity)
- Previous Less/Greater (compute left boundaries)
- Histogram area using indices and sentinel
- Remove digits/letters to maintain monotonic invariant

Covered (from syllabus and extras):
- 739 Daily Temperatures
- 84 Largest Rectangle in Histogram
- 496 Next Greater Element I
- 503 Next Greater Element II
- 316 Remove Duplicate Letters
- 402 Remove K Digits

Implemented:
- 496 Next Greater Element I
  - File: solutions/monotonic_stack/0496_next_greater_element_i.cpp
  - Technique: Decreasing stack over nums2 to map each value to its next greater; lookup for nums1.
  - Complexity: O(n + m) time, O(n) space.

Planned (to be added):
- 739 Daily Temperatures
- 84 Largest Rectangle in Histogram
- 503 Next Greater Element II
- 316 Remove Duplicate Letters
- 402 Remove K Digits

Notes:
- All solutions use C++ STL (vector, stack, unordered_map) with clear top-of-file problem headers.
- Editor IntelliSense may show false STL errors; code targets standard LeetCode toolchains.