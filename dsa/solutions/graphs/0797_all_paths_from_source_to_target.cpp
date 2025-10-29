/*
LeetCode 797. All Paths From Source to Target
Link: https://leetcode.com/problems/all-paths-from-source-to-target/

Question:
Given a directed acyclic graph (DAG) of n nodes labeled from 0 to n - 1, represented as an adjacency list,
return all possible paths from node 0 to node n - 1.

Constraints:
- 2 <= n <= 15
- graph[i] is a list of nodes you can visit from node i
- graph[i][j] is in range [0, n-1]
- The input graph is a DAG

Approach (DFS path enumeration):
- Use DFS from node 0 to n-1, maintaining a current path vector.
- On reaching target, append the current path to results.
- Backtrack after each neighbor exploration.

Complexity:
- Time: O(P * L) where P = number of paths and L = average path length
- Space: O(L) recursion stack + O(P * L) for output
*/

#include <vector>

class Solution {
    void dfs(int u, int target, const std::vector<std::vector<int>>& graph,
             std::vector<int>& path, std::vector<std::vector<int>>& res) {
        if (u == target) {
            res.push_back(path);
            return;
        }
        const std::vector<int>& nbrs = graph[u];
        for (size_t i = 0; i < nbrs.size(); ++i) {
            int v = nbrs[i];
            path.push_back(v);
            dfs(v, target, graph, path, res);
            path.pop_back();
        }
    }
public:
    std::vector<std::vector<int>> allPathsSourceTarget(std::vector<std::vector<int>>& graph) {
        int n = (int)graph.size();
        std::vector<std::vector<int>> res;
        if (n == 0) return res;
        std::vector<int> path;
        path.push_back(0);
        dfs(0, n - 1, graph, path, res);
        return res;
    }
};