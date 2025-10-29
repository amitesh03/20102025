# Greedy & Intervals — Practice Overview

Scope:
- Concepts: interval scheduling, merging, greedy selection by end-time, sweeping endpoints
- Language: C++ STL
- Each solution file includes the problem statement at the top in comments and uses idiomatic STL.

Syllabus source: [syllabus/syllabus.md](../../syllabus/syllabus.md)

## Problems and Status

- [x] 122. Best Time to Buy and Sell Stock II
  - LeetCode: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/
  - Solution: [solutions/greedy_intervals/0122_best_time_to_buy_and_sell_stock_ii.cpp](./0122_best_time_to_buy_and_sell_stock_ii.cpp)
- [x] 135. Candy
  - LeetCode: https://leetcode.com/problems/candy/
  - Solution: [solutions/greedy_intervals/0135_candy.cpp](./0135_candy.cpp)
- [x] 253. Meeting Rooms II
  - LeetCode: https://leetcode.com/problems/meeting-rooms-ii/
  - Solution: [solutions/greedy_intervals/0253_meeting_rooms_ii.cpp](./0253_meeting_rooms_ii.cpp)
- [x] 452. Minimum Number of Arrows to Burst Balloons
  - LeetCode: https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/
  - Solution: [solutions/greedy_intervals/0452_minimum_number_of_arrows_to_burst_balloons.cpp](./0452_minimum_number_of_arrows_to_burst_balloons.cpp)
- [x] 1029. Two City Scheduling
  - LeetCode: https://leetcode.com/problems/two-city-scheduling/
  - Solution: [solutions/greedy_intervals/01029_two_city_scheduling.cpp](./01029_two_city_scheduling.cpp)

## Related and Cross-Referenced

- Non-overlapping intervals (435) and general merge (56) are placed under Arrays:
  - [solutions/arrays/0435_non_overlapping_intervals.cpp](../arrays/0435_non_overlapping_intervals.cpp)
  - [solutions/arrays/0056_merge_intervals.cpp](../arrays/0056_merge_intervals.cpp)
- Additional sweep-line problems are under Intervals & Sweep Line:
  - [solutions/intervals_sweep_line/README.md](../intervals_sweep_line/README.md)
- Segment-tree-based event scheduling and counting are under Segment Tree:
  - [solutions/segment_tree/README.md](../segment_tree/README.md)

## Notes

- Greedy interval selection typically sorts by end time to maximize non-overlapping choices (e.g., 452).
- When resources are constrained by overlaps (e.g., 253), use min-heaps or difference arrays to track concurrent intervals.
- For any missing problems or corrections, update this README and add the corresponding solution file with the problem statement header.