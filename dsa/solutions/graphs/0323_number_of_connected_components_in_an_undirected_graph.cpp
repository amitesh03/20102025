/*
LeetCode 323. Number of Connected Components in an Undirected Graph
Link: https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/

Question:
Given n nodes labeled 0..n-1 and a list of undirected edges, return the number of connected components.

Constraints:
- 1 <= n <= 2 * 10^5
- 0 <= edges.length <= 2 * 10^5
- edges[i].length == 2

Approach (DFS/BFS on adjacency):
- Build adjacency list for the undirected graph.
- Iterate nodes; for each unvisited node, perform BFS to mark its component.
- Increment component count each time BFS starts.

Complexity:
- Time: O(n + m)
- Space: O(n + m)
*/

#include <vector>
#include <queue>

class Solution {
public:
    int countComponents(int n, std::vector<std::vector<int>>& edges) {
        std::vector<std::vector<int>> adj(n);
        adj.reserve(n);
        for (size_t i = 0; i < edges.size(); ++i) {
            int u = edges[i][0];
            int v = edges[i][1];
            adj[u].push_back(v);
            adj[v].push_back(u);
        }

        std::vector<char> seen(n, 0);
        int components = 0;
        std::queue<int> q;
        for (int i = 0; i < n; ++i) {
            if (seen[i]) continue;
            ++components;
            seen[i] = 1;
            q.push(i);
            while (!q.empty()) {
                int u = q.front();
                q.pop();
                const std::vector<int>& nbrs = adj[u];
                for (size_t j = 0; j < nbrs.size(); ++j) {
                    int v = nbrs[j];
                    if (!seen[v]) {
                        seen[v] = 1;
                        q.push(v);
                    }
                }
            }
        }
        return components;
    }
};