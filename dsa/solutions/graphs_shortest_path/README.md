# Graphs — Shortest Paths

C++ STL solutions for common shortest path problems. Each file starts with the problem header, link, approach, and complexity.

## Index

1) 743. Network Delay Time
- LeetCode: https://leetcode.com/problems/network-delay-time/
- Solution: solutions/graphs_shortest_path/0743_network_delay_time.cpp
- Approach:
  - Dijkstra using adjacency list and min-heap (priority_queue with greater).
  - Track distances; result is max(dist) if all nodes reached, else -1.
- Complexity: O(E log V)

2) 1631. Path With Minimum Effort
- LeetCode: https://leetcode.com/problems/path-with-minimum-effort/
- Solution: solutions/graphs_shortest_path/1631_path_with_minimum_effort.cpp
- Approach:
  - Grid Dijkstra where edge weight is abs(height diff).
  - Path cost is the max edge along the path (minimax); relax with max(current, edge).
- Complexity: O(mn log mn)

3) 787. Cheapest Flights Within K Stops
- LeetCode: https://leetcode.com/problems/cheapest-flights-within-k-stops/
- Solution: solutions/graphs_shortest_path/0787_cheapest_flights_within_k_stops.cpp
- Approach:
  - Bellman-Ford variant with K+1 relaxations using prev-round distances to limit stops.
- Complexity: O(K * E)

4) 1162. As Far from Land as Possible
- LeetCode: https://leetcode.com/problems/as-far-from-land-as-possible/
- Solution: solutions/graphs_shortest_path/1162_as_far_from_land_as_possible.cpp
- Approach:
  - Multi-source BFS from all land cells simultaneously; last expanded distance is the answer.
- Complexity: O(mn)

5) 1293. Shortest Path in a Grid with Obstacles Elimination
- LeetCode: https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/
- Solution: solutions/graphs_shortest_path/1293_shortest_path_in_a_grid_with_obstacles_elimination.cpp
- Approach:
  - BFS with state (i, j, remaining_k).
  - Dominance pruning: keep best remaining_k per cell; skip worse states.
- Complexity: O(mn * k)

## Files

- 0743: solutions/graphs_shortest_path/0743_network_delay_time.cpp
- 1631: solutions/graphs_shortest_path/1631_path_with_minimum_effort.cpp
- 0787: solutions/graphs_shortest_path/0787_cheapest_flights_within_k_stops.cpp
- 1162: solutions/graphs_shortest_path/1162_as_far_from_land_as_possible.cpp
- 1293: solutions/graphs_shortest_path/1293_shortest_path_in_a_grid_with_obstacles_elimination.cpp

## Notes

- Implementations rely on STL containers: vector, priority_queue, queue, pair, etc.
- If your editor flags false errors about std::vector members or iterators, it is an editor tooling issue; the code compiles on standard C++ toolchains and is accepted on LeetCode.