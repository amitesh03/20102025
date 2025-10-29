# Graphs — Practice Overview

Scope:
- Concepts: adjacency list, BFS/DFS, topological sort, multi-source BFS, component checks
- Language: C++ STL
- Each solution file includes the problem statement at the top in comments and uses idiomatic STL.

Syllabus source: [syllabus/syllabus.md](../../syllabus/syllabus.md)

## Problems and Status

- [x] 127. Word Ladder
  - LeetCode: https://leetcode.com/problems/word-ladder/
  - Solution: [solutions/graphs/0127_word_ladder.cpp](./0127_word_ladder.cpp)
- [x] 130. Surrounded Regions
  - LeetCode: https://leetcode.com/problems/surrounded-regions/
  - Solution: [solutions/graphs/0130_surrounded_regions.cpp](./0130_surrounded_regions.cpp)
- [x] 133. Clone Graph
  - LeetCode: https://leetcode.com/problems/clone-graph/
  - Solution: [solutions/graphs/0133_clone_graph.cpp](./0133_clone_graph.cpp)
- [x] 200. Number of Islands
  - LeetCode: https://leetcode.com/problems/number-of-islands/
  - Solution: [solutions/graphs/0200_number_of_islands.cpp](./0200_number_of_islands.cpp)
- [x] 207. Course Schedule
  - LeetCode: https://leetcode.com/problems/course-schedule/
  - Solution: [solutions/graphs/0207_course_schedule.cpp](./0207_course_schedule.cpp)
- [x] 210. Course Schedule II
  - LeetCode: https://leetcode.com/problems/course-schedule-ii/
  - Solution: [solutions/graphs/0210_course_schedule_ii.cpp](./0210_course_schedule_ii.cpp)
- [x] 261. Graph Valid Tree
  - LeetCode: https://leetcode.com/problems/graph-valid-tree/
  - Solution: [solutions/graphs/0261_graph_valid_tree.cpp](./0261_graph_valid_tree.cpp)
- [x] 310. Minimum Height Trees
  - LeetCode: https://leetcode.com/problems/minimum-height-trees/
  - Solution: [solutions/graphs/0310_minimum_height_trees.cpp](./0310_minimum_height_trees.cpp)
- [x] 323. Number of Connected Components in an Undirected Graph
  - LeetCode: https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/
  - Solution: [solutions/graphs/0323_number_of_connected_components_in_an_undirected_graph.cpp](./0323_number_of_connected_components_in_an_undirected_graph.cpp)
- [x] 399. Evaluate Division
  - LeetCode: https://leetcode.com/problems/evaluate-division/
  - Solution: [solutions/graphs/0399_evaluate_division.cpp](./0399_evaluate_division.cpp)
- [x] 417. Pacific Atlantic Water Flow
  - LeetCode: https://leetcode.com/problems/pacific-atlantic-water-flow/
  - Solution: [solutions/graphs/0417_pacific_atlantic_water_flow.cpp](./0417_pacific_atlantic_water_flow.cpp)
- [x] 542. 01 Matrix
  - LeetCode: https://leetcode.com/problems/01-matrix/
  - Solution: [solutions/graphs/0542_01_matrix.cpp](./0542_01_matrix.cpp)
- [x] 695. Max Area of Island
  - LeetCode: https://leetcode.com/problems/max-area-of-island/
  - Solution: [solutions/graphs/0695_max_area_of_island.cpp](./0695_max_area_of_island.cpp)
- [x] 733. Flood Fill
  - LeetCode: https://leetcode.com/problems/flood-fill/
  - Solution: [solutions/graphs/0733_flood_fill.cpp](./0733_flood_fill.cpp)
- [x] 752. Open the Lock
  - LeetCode: https://leetcode.com/problems/open-the-lock/
  - Solution: [solutions/graphs/0752_open_the_lock.cpp](./0752_open_the_lock.cpp)
- [x] 785. Is Graph Bipartite?
  - LeetCode: https://leetcode.com/problems/is-graph-bipartite/
  - Solution: [solutions/graphs/0785_is_graph_bipartite.cpp](./0785_is_graph_bipartite.cpp)
- [x] 797. All Paths From Source to Target
  - LeetCode: https://leetcode.com/problems/all-paths-from-source-to-target/
  - Solution: [solutions/graphs/0797_all_paths_from_source_to_target.cpp](./0797_all_paths_from_source_to_target.cpp)
- [x] 802. Find Eventual Safe States
  - LeetCode: https://leetcode.com/problems/find-eventual-safe-states/
  - Solution: [solutions/graphs/0802_find_eventual_safe_states.cpp](./0802_find_eventual_safe_states.cpp)
- [x] 841. Keys and Rooms
  - LeetCode: https://leetcode.com/problems/keys-and-rooms/
  - Solution: [solutions/graphs/0841_keys_and_rooms.cpp](./0841_keys_and_rooms.cpp)
- [x] 886. Possible Bipartition
  - LeetCode: https://leetcode.com/problems/possible-bipartition/
  - Solution: [solutions/graphs/0886_possible_bipartition.cpp](./0886_possible_bipartition.cpp)
- [x] 994. Rotting Oranges
  - LeetCode: https://leetcode.com/problems/rotting-oranges/
  - Solution: [solutions/graphs/0994_rotting_oranges.cpp](./0994_rotting_oranges.cpp)
- [x] 997. Find the Town Judge
  - LeetCode: https://leetcode.com/problems/find-the-town-judge/
  - Solution: [solutions/graphs/0997_find_the_town_judge.cpp](./0997_find_the_town_judge.cpp)
- [x] 1020. Number of Enclaves
  - LeetCode: https://leetcode.com/problems/number-of-enclaves/
  - Solution: [solutions/graphs/1020_number_of_enclaves.cpp](./1020_number_of_enclaves.cpp)
- [x] 1091. Shortest Path in Binary Matrix
  - LeetCode: https://leetcode.com/problems/shortest-path-in-binary-matrix/
  - Solution: [solutions/graphs/1091_shortest_path_in_binary_matrix.cpp](./1091_shortest_path_in_binary_matrix.cpp)
- [x] 1971. Find if Path Exists in Graph
  - LeetCode: https://leetcode.com/problems/find-if-path-exists-in-graph/
  - Solution: [solutions/graphs/1971_find_if_path_exists_in_graph.cpp](./1971_find_if_path_exists_in_graph.cpp)

## Notes

- Coverage includes BFS flood-fill, DFS cloning, Kahn’s algorithm for topological ordering, reverse-flow BFS on grids, and leaf-stripping centroid finding.
- For shortest-path problems and variants (Dijkstra/0-1 BFS), see Algorithmic Patterns directories.
- For DSU-based graph tasks, see the Union-Find topic directory.