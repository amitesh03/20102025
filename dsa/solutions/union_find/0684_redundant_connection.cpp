/*
LeetCode 684. Redundant Connection
Link: https://leetcode.com/problems/redundant-connection/

Question:
In this problem, a tree is an undirected graph that is connected and has no cycles.
You are given a graph that started as a tree with n nodes labeled from 1 to n, with one additional edge added.
The added edge connects two different vertices already connected by some path, forming a cycle.
Return an edge that can be removed so that the resulting graph is a tree of n nodes.
If there are multiple answers, return the edge that occurs last in the input.

Constraints:
- n == edges.length
- 3 <= n <= 1000
- edges[i].length == 2
- 1 <= ui, vi <= n
- There are no repeated edges, and the given graph is connected.
*/

#include <vector>
#include <cstddef>

class Solution {
    std::vector<int> parent;
    std::vector<int> rnk;

    int findp(int x) {
        if (parent[x] != x) parent[x] = findp(parent[x]);
        return parent[x];
    }
    bool unite(int a, int b) {
        int pa = findp(a), pb = findp(b);
        if (pa == pb) return false;
        if (rnk[pa] < rnk[pb]) {
            parent[pa] = pb;
        } else if (rnk[pa] > rnk[pb]) {
            parent[pb] = pa;
        } else {
            parent[pb] = pa;
            ++rnk[pa];
        }
        return true;
    }

public:
    std::vector<int> findRedundantConnection(std::vector<std::vector<int>>& edges) {
        int n = static_cast<int>(edges.size());
        parent.resize(n + 1);
        rnk.assign(n + 1, 0);
        for (int i = 1; i <= n; ++i) parent[i] = i;
        std::vector<int> ans;
        for (std::size_t i = 0; i < edges.size(); ++i) {
            int u = edges[i][0];
            int v = edges[i][1];
            if (!unite(u, v)) ans = {u, v};
        }
        return ans;
    }
};

/*
Approach:
- Use Disjoint Set Union (Union-Find) to detect the first edge that closes a cycle.
- Iterate edges; if unite(u, v) returns false, that edge is redundant. Keep latest occurrence to satisfy problem requirement.

Complexity:
- Time: O(n α(n)) where n = edges.size(), practically near-linear.
- Space: O(n) for DSU arrays.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    std::vector<std::vector<int>> e = {{1,2},{1,3},{2,3}};
    std::vector<int> r = sol.findRedundantConnection(e);
    std::cout << r[0] << "," << r[1] << "\n"; // 2,3
    return 0;
}
#endif