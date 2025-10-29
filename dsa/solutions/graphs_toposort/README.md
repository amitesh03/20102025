# Graphs — Topological Sort

C++ STL solutions for topological sorting problems. Each file starts with the problem header, link, approach, and complexity.

## Index

1) 269. Alien Dictionary
- LeetCode: https://leetcode.com/problems/alien-dictionary/
- Solution: solutions/graphs_toposort/0269_alien_dictionary.cpp
- Approach:
  - Build adjacency using pairwise comparison of adjacent words to infer letter order.
  - Detect invalid prefix case (e.g., "abc" before "ab").
  - Run Kahn’s algorithm (BFS indegree) to produce an order; verify all nodes are output.
- Complexity: O(V + E) over distinct letters and inferred edges.

2) 444. Sequence Reconstruction
- LeetCode: https://leetcode.com/problems/sequence-reconstruction/
- Solution: solutions/graphs_toposort/0444_sequence_reconstruction.cpp
- Approach:
  - Construct graph from subsequences.
  - Kahn’s algorithm with uniqueness check: queue must have exactly one node at each step.
  - Verify the produced order equals the target org.
- Complexity: O(V + E).

## Files

- 0269: solutions/graphs_toposort/0269_alien_dictionary.cpp
- 0444: solutions/graphs_toposort/0444_sequence_reconstruction.cpp

## Notes

- Implementations rely on STL containers like vector, queue, unordered_map, unordered_set.
- If your editor flags false errors for standard vector methods, it’s an editor tooling issue; the code compiles fine on standard C++ toolchains and is accepted on LeetCode.