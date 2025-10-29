/*
LeetCode 310. Minimum Height Trees
Link: https://leetcode.com/problems/minimum-height-trees/

Question:
Given an undirected graph of n nodes labeled from 0 to n - 1 and a list of edges,
return a list of all possible roots of Minimum Height Trees (MHTs).

Constraints:
- 1 <= n <= 2 * 10^5
- edges.length == n - 1 (tree)

Approach (Peel leaves / Topological trimming):
- A tree's centers (1 or 2 nodes) are roots of MHTs.
- Iteratively remove leaves (degree 1) layer by layer until <= 2 nodes remain.
- The remaining nodes are centers.

Complexity:
- Time: O(n)
- Space: O(n)
*/

#include <vector>
#include <queue>

class Solution {
public:
    std::vector<int> findMinHeightTrees(int n, std::vector<std::vector<int>>& edges) {
        if (n == 1) return {0};
        std::vector<std::vector<int>> adj(n);
        std::vector<int> deg(n, 0);
        for (size_t i = 0; i < edges.size(); ++i) {
            int u = edges[i][0];
            int v = edges[i][1];
            adj[u].push_back(v);
            adj[v].push_back(u);
            ++deg[u];
            ++deg[v];
        }
        std::queue<int> q;
        for (int i = 0; i < n; ++i) {
            if (deg[i] == 1) q.push(i);
        }
        int remaining = n;
        while (remaining > 2) {
            int sz = (int)q.size();
            remaining -= sz;
            for (int i = 0; i < sz; ++i) {
                int leaf = q.front(); q.pop();
                for (size_t j = 0; j < adj[leaf].size(); ++j) {
                    int nei = adj[leaf][j];
                    if (--deg[nei] == 1) q.push(nei);
                }
            }
        }
        std::vector<int> centers;
        centers.reserve(q.size());
        while (!q.empty()) {
            centers.push_back(q.front()); q.pop();
        }
        return centers;
    }
};