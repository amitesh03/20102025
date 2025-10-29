/*
LeetCode 802. Find Eventual Safe States
Link: https://leetcode.com/problems/find-eventual-safe-states/

Question:
Given a directed graph, a node is safe if every possible path starting from that node leads to a terminal node
(i.e., a node with no outgoing edges). Return all the safe nodes in ascending order.

Constraints:
- n == graph.size
- 1 <= n <= 10^4
- sum(graph[i].size) <= 10^4

Approach (DFS with color marking):
- Use colors to mark states: 0 = unvisited, 1 = visiting (in call stack), 2 = safe, 3 = unsafe.
- DFS(u):
  - If u is visiting (color 1), we found a cycle -> unsafe.
  - If u is already safe (2), return true; if unsafe (3), return false.
  - Mark u visiting, DFS all neighbors; if any neighbor is unsafe, u is unsafe.
  - Otherwise mark u safe.
- Collect all nodes for which DFS returns safe.

Complexity:
- Time: O(n + m), where m = total edges
- Space: O(n) for color + recursion stack
*/

#include <vector>
#include <functional>

class Solution {
public:
    std::vector<int> eventualSafeNodes(std::vector<std::vector<int>>& graph) {
        int n = (int)graph.size();
        std::vector<int> color(n, 0);

        // DFS returns true if node u is safe (no cycle reachable), false if unsafe
        std::function<bool(int)> dfs = [&](int u) -> bool {
            if (color[u] == 1) return false;      // cycle detected
            if (color[u] == 2) return true;       // already marked safe
            if (color[u] == 3) return false;      // already marked unsafe
            color[u] = 1; // visiting
            const std::vector<int>& nbrs = graph[u];
            for (size_t i = 0; i < nbrs.size(); ++i) {
                int v = nbrs[i];
                if (!dfs(v)) {
                    color[u] = 3;
                    return false;
                }
            }
            color[u] = 2;
            return true;
        };

        std::vector<int> res;
        res.reserve(n);
        for (int i = 0; i < n; ++i) {
            if (dfs(i)) res.push_back(i);
        }
        return res;
    }
};