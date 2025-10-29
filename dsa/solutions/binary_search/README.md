# Binary Search — Practice Overview

Scope:
- Concepts: classic binary search on indices/values, answer-space binary search, monotonic predicates
- Language: C++ STL
- Each solution file includes the problem statement at the top in comments and uses idiomatic STL.

Syllabus source: [syllabus/syllabus.md](../../syllabus/syllabus.md)

## Problems and Status

- [x] 4. Median of Two Sorted Arrays
  - LeetCode: https://leetcode.com/problems/median-of-two-sorted-arrays/
  - Solution: [solutions/binary_search/0004_median_of_two_sorted_arrays.cpp](./0004_median_of_two_sorted_arrays.cpp)
- [x] 34. Find First and Last Position of Element in Sorted Array
  - LeetCode: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
  - Solution: [solutions/binary_search/0034_find_first_and_last_position_of_element_in_sorted_array.cpp](./0034_find_first_and_last_position_of_element_in_sorted_array.cpp)
- [x] 74. Search a 2D Matrix
  - LeetCode: https://leetcode.com/problems/search-a-2d-matrix/
  - Solution: [solutions/binary_search/0074_search_a_2d_matrix.cpp](./0074_search_a_2d_matrix.cpp)
- [x] 153. Find Minimum in Rotated Sorted Array
  - LeetCode: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
  - Solution: [solutions/binary_search/0153_find_minimum_in_rotated_sorted_array.cpp](./0153_find_minimum_in_rotated_sorted_array.cpp)
- [x] 378. Kth Smallest Element in a Sorted Matrix
  - LeetCode: https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/
  - Solution: [solutions/binary_search/0378_kth_smallest_element_in_a_sorted_matrix.cpp](./0378_kth_smallest_element_in_a_sorted_matrix.cpp)
- [x] 410. Split Array Largest Sum
  - LeetCode: https://leetcode.com/problems/split-array-largest-sum/
  - Solution: [solutions/binary_search/0410_split_array_largest_sum.cpp](./0410_split_array_largest_sum.cpp)
- [x] 540. Single Element in a Sorted Array
  - LeetCode: https://leetcode.com/problems/single-element-in-a-sorted-array/
  - Solution: [solutions/binary_search/0540_single_element_in_a_sorted_array.cpp](./0540_single_element_in_a_sorted_array.cpp)
- [x] 875. Koko Eating Bananas
  - LeetCode: https://leetcode.com/problems/koko-eating-bananas/
  - Solution: [solutions/binary_search/0875_koko_eating_bananas.cpp](./0875_koko_eating_bananas.cpp)
- [x] 1011. Capacity To Ship Packages Within D Days
  - LeetCode: https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/
  - Solution: [solutions/binary_search/1011_capacity_to_ship_packages_within_d_days.cpp](./1011_capacity_to_ship_packages_within_d_days.cpp)

## Notes

- For answer-space binary search (e.g., 410, 875, 1011), define a monotonic feasibility function and binary search the minimal value that satisfies it.
- Matrix problems (74, 378) use index mapping or value-space strategies depending on constraints.
- When duplicates affect index parity (540), use parity logic on halves to isolate the single element.
- For any missing problems or corrections, update this README and add the corresponding solution file with the problem statement header.