# K-way Merge — Practice Overview

Scope:
- Concepts: merging across multiple sorted lists/streams, heap-based selection, pointers
- Language: C++ STL
- Each solution file includes the problem statement at the top in comments and uses idiomatic STL.

Syllabus source: [syllabus/syllabus.md](../../syllabus/syllabus.md)

## Problems and Status

- [x] 632. Smallest Range Covering Elements from K Lists
  - LeetCode: https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/
  - Solution: [solutions/k_way_merge/0632_smallest_range_covering_elements_from_k_lists.cpp](./0632_smallest_range_covering_elements_from_k_lists.cpp)

## Notes

- Typical approach uses a min-heap (priority_queue with custom comparator) holding one element from each list and a pointer to the current maximum among the selected elements; update the range while advancing the list that contributed the minimum.
- For any missing problems or corrections, update this README and add the corresponding solution file with the problem statement header.