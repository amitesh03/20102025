# Fenwick Tree (Binary Indexed Tree) — Practice Overview

Scope:
- Concepts: point updates, prefix sums, frequency tables, order statistics via coordinate compression
- Language: C++ STL
- Each solution file includes the problem statement at the top in comments and uses idiomatic STL.

Syllabus source: [syllabus/syllabus.md](../../syllabus/syllabus.md)

## Problems and Status

- [x] 1649. Create Sorted Array through Instructions
  - LeetCode: https://leetcode.com/problems/create-sorted-array-through-instructions/
  - Solution: [solutions/segment_tree_fenwick/1649_create_sorted_array_through_instructions.cpp](./1649_create_sorted_array_through_instructions.cpp)

## Notes

- Typical BIT operations:
  - add(idx, delta): update frequency at index
  - sum(idx): prefix sum query [1..idx]
- Coordinate compression is commonly applied to map large values into [1..M] for BIT indices.
- Alternative approaches for some problems:
  - Ordered set/multiset with order statistics (if available) or policy-based data structures (non-standard in LeetCode)
  - Segment tree for range queries/updates when BIT cannot directly support required operations
- Related folders:
  - Segment tree variants and event-sweep solutions: [solutions/segment_tree/README.md](../segment_tree/README.md)