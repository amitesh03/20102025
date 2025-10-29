# Union-Find (Disjoint Set) — Practice Overview

Scope:
- Concepts: union by rank, path compression, component counting
- Language: C++ STL
- Each solution file includes the problem statement at the top in comments and uses idiomatic STL.

Syllabus source: [syllabus/syllabus.md](../../syllabus/syllabus.md)

## Problems and Status

- [x] 684. Redundant Connection
  - LeetCode: https://leetcode.com/problems/redundant-connection/
  - Solution: [solutions/union_find/0684_redundant_connection.cpp](./0684_redundant_connection.cpp)
- [x] 547. Number of Provinces
  - LeetCode: https://leetcode.com/problems/number-of-provinces/
  - Solution: [solutions/union_find/0547_number_of_provinces.cpp](./0547_number_of_provinces.cpp)
- [x] 721. Accounts Merge
  - LeetCode: https://leetcode.com/problems/accounts-merge/
  - Solution: [solutions/union_find/0721_accounts_merge.cpp](./0721_accounts_merge.cpp)
- [x] 1319. Number of Operations to Make Network Connected
  - LeetCode: https://leetcode.com/problems/number-of-operations-to-make-network-connected/
  - Solution: [solutions/union_find/1319_number_of_operations_to_make_network_connected.cpp](./1319_number_of_operations_to_make_network_connected.cpp)
- [x] 959. Regions Cut By Slashes
  - LeetCode: https://leetcode.com/problems/regions-cut-by-slashes/
  - Solution: [solutions/union_find/0959_regions_cut_by_slashes.cpp](./0959_regions_cut_by_slashes.cpp)
- [x] 947. Most Stones Removed with Same Row or Column
  - LeetCode: https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/
  - Solution: [solutions/union_find/0947_most_stones_removed_with_same_row_or_column.cpp](./0947_most_stones_removed_with_same_row_or_column.cpp)
- [x] 685. Redundant Connection II
  - LeetCode: https://leetcode.com/problems/redundant-connection-ii/
  - Solution: [solutions/union_find/0685_redundant_connection_ii.cpp](./0685_redundant_connection_ii.cpp)
- [x] 1202. Smallest String With Swaps
  - LeetCode: https://leetcode.com/problems/smallest-string-with-swaps/
  - Solution: [solutions/union_find/1202_smallest_string_with_swaps.cpp](./1202_smallest_string_with_swaps.cpp)

## Notes

- DSU implemented with parent vector and rank/size for efficient unions; path compression in find.
- Grid-based problems (959) use index mapping and union operations across subdivided cells.
- For merging accounts (721), union by email to account index then group by representative.