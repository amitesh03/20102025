# Segment Tree — Practice Overview

Scope:
- Concepts: segment tree (point/range updates, queries), coordinate compression, lazy propagation
- Language: C++ STL
- Each solution file includes the problem statement at the top in comments and uses idiomatic STL.

Syllabus source: [syllabus/syllabus.md](../../syllabus/syllabus.md)

## Problems and Status

- [x] 218. The Skyline Problem
  - LeetCode: https://leetcode.com/problems/the-skyline-problem/
  - Solution: [solutions/segment_tree/0218_the_skyline_problem.cpp](./0218_the_skyline_problem.cpp)
- [x] 307. Range Sum Query - Mutable
  - LeetCode: https://leetcode.com/problems/range-sum-query-mutable/
  - Solution: [solutions/segment_tree/0307_range_sum_query_mutable.cpp](./0307_range_sum_query_mutable.cpp)
- [x] 315. Count of Smaller Numbers After Self
  - LeetCode: https://leetcode.com/problems/count-of-smaller-numbers-after-self/
  - Solution: [solutions/segment_tree/0315_count_of_smaller_numbers_after_self.cpp](./0315_count_of_smaller_numbers_after_self.cpp)
- [x] 493. Reverse Pairs
  - LeetCode: https://leetcode.com/problems/reverse-pairs/
  - Solution: [solutions/segment_tree/0493_reverse_pairs.cpp](./0493_reverse_pairs.cpp)
- [x] 732. My Calendar III
  - LeetCode: https://leetcode.com/problems/my-calendar-iii/
  - Solution: [solutions/segment_tree/0732_my_calendar_iii.cpp](./0732_my_calendar_iii.cpp)

## Notes

- For Fenwick Tree/BIT problems, see [solutions/segment_tree_fenwick/README.md](../segment_tree_fenwick/README.md)
- Many solutions use coordinate compression to keep tree size compact.
- When constraints allow, alternative approaches may be included in problem headers.