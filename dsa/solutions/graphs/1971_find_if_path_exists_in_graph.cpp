/*
LeetCode 1971. Find if Path Exists in Graph
Link: https://leetcode.com/problems/find-if-path-exists-in-graph/

Question:
Given n nodes labeled from 0 to n - 1 and a list of undirected edges. Determine if there is a valid
path between source and destination.

Constraints:
- 1 <= n <= 2 * 10^5
- 0 <= edges.length <= 2 * 10^5
- edges[i].length == 2
- 0 <= source, destination < n

Approach (BFS on adjacency):
- Build adjacency list for the undirected graph.
- BFS from source; if destination is reached, return true; otherwise false when queue exhausts.

Complexity:
- Time: O(n + m) where m = edges.length
- Space: O(n + m)
*/

#include <vector>
#include <queue>

class Solution {
public:
    bool validPath(int n, std::vector<std::vector<int>>& edges, int source, int destination) {
        if (source == destination) return true;

        std::vector<std::vector<int>> adj(n);
        adj.reserve(n);
        for (size_t i = 0; i < edges.size(); ++i) {
            int u = edges[i][0];
            int v = edges[i][1];
            adj[u].push_back(v);
            adj[v].push_back(u);
        }

        std::vector<char> seen(n, 0);
        std::queue<int> q;
        seen[source] = 1;
        q.push(source);

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            if (u == destination) return true;
            const std::vector<int>& nbrs = adj[u];
            for (size_t i = 0; i < nbrs.size(); ++i) {
                int v = nbrs[i];
                if (!seen[v]) {
                    seen[v] = 1;
                    q.push(v);
                }
            }
        }
        return false;
    }
};