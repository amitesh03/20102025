/*
LeetCode 1557. Minimum Number of Vertices to Reach All Nodes
Link: https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/

Question:
Given a directed graph with n nodes labeled from 0 to n-1 and a list of directed edges,
return the minimum number of vertices needed to reach all nodes. The answer is the set of
all nodes with indegree zero.

Constraints:
- 1 <= n <= 10^5
- 0 <= edges.length <= 10^5
- edges[i] = [from, to]

Approach (Indegree Zero):
- Any node with indegree 0 cannot be reached from other nodes; it must be included.
- Nodes with indegree > 0 are reachable from at least one incoming edge.
- Therefore, the minimal set is exactly the set of nodes with indegree 0.

Complexity:
- Time: O(n + m), where m = edges.length
- Space: O(n)
*/

#include <vector>

class Solution {
public:
    std::vector<int> findSmallestSetOfVertices(int n, std::vector<std::vector<int>>& edges) {
        std::vector<int> indeg(n, 0);
        for (size_t i = 0; i < edges.size(); ++i) {
            int u = edges[i][0];
            int v = edges[i][1];
            (void)u;
            ++indeg[v];
        }
        std::vector<int> res;
        res.reserve(n);
        for (int i = 0; i < n; ++i) {
            if (indeg[i] == 0) res.push_back(i);
        }
        return res;
    }
};