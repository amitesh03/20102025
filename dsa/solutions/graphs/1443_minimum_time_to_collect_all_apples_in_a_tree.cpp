/*
LeetCode 1443. Minimum Time to Collect All Apples in a Tree
Link: https://leetcode.com/problems/minimum-time-to-collect-all-apples-in-a-tree/

Question:
You are given an integer n (nodes labeled 0..n-1), edges forming an undirected tree, and hasApple indicating
whether each node has an apple. Starting at node 0, each edge traversal costs 1 second. Return the minimum time
to collect all apples and return to node 0. If there are no apples, return 0.

Constraints:
- 1 <= n <= 100000
- edges.size() == n - 1
- hasApple.size() == n

Approach (DFS accumulate needed edges):
- Build adjacency for the undirected tree.
- DFS from 0; for each child subtree, if it contains an apple (either at the child or deeper), add childCost + 2
  to account for going to the child and back.
- The root's cost is the answer (no need to subtract 2 because we must return to 0).

Complexity:
- Time: O(n)
- Space: O(n)
*/

#include <vector>
#include <functional>

class Solution {
public:
    int minTime(int n, std::vector<std::vector<int>>& edges, std::vector<bool>& hasApple) {
        std::vector<std::vector<int>> adj(n);
        adj.reserve(n);
        for (size_t i = 0; i < edges.size(); ++i) {
            int u = edges[i][0];
            int v = edges[i][1];
            adj[u].push_back(v);
            adj[v].push_back(u);
        }

        std::function<int(int,int)> dfs = [&](int u, int p) -> int {
            int cost = 0;
            const std::vector<int>& nbrs = adj[u];
            for (size_t i = 0; i < nbrs.size(); ++i) {
                int v = nbrs[i];
                if (v == p) continue;
                int childCost = dfs(v, u);
                if (childCost > 0 || hasApple[v]) {
                    cost += childCost + 2;
                }
            }
            return cost;
        };

        int total = dfs(0, -1);
        return total;
    }
};