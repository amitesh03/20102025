/*
LeetCode 261. Graph Valid Tree
Link: https://leetcode.com/problems/graph-valid-tree/

Question:
You are given n nodes labeled from 0 to n - 1 and a list of undirected edges (u, v).
Determine if these edges make up a valid tree.
A valid tree must be connected and acyclic.

Constraints:
- 1 <= n <= 2 * 10^4
- 0 <= edges.length <= 2 * 10^4
- edges[i].length == 2
- 0 <= ui, vi < n
*/

#include <vector>
#include <cstddef>

class Solution {
private:
    std::vector<int> parent;
    std::vector<int> rnk;

    int findp(int x) {
        if (parent[x] != x) parent[x] = findp(parent[x]);
        return parent[x];
    }

    bool unite(int a, int b) {
        int pa = findp(a);
        int pb = findp(b);
        if (pa == pb) return false; // cycle
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
    bool validTree(int n, std::vector<std::vector<int>>& edges) {
        // A tree with n nodes must have exactly n - 1 edges and be acyclic/connected.
        if (n <= 0) return false;
        if (static_cast<int>(edges.size()) != n - 1) return false;

        parent.resize(n);
        rnk.assign(n, 0);
        for (int i = 0; i < n; ++i) parent[i] = i;

        for (std::size_t i = 0; i < edges.size(); ++i) {
            int u = edges[i][0];
            int v = edges[i][1];
            if (u < 0 || u >= n || v < 0 || v >= n) return false;
            if (!unite(u, v)) return false; // cycle detected
        }

        // If we have exactly n - 1 edges and no cycle, the graph is connected -> valid tree.
        return true;
    }
};

/*
Approach:
- Use Disjoint Set Union (Union-Find). For a valid tree with n nodes: edges.size() must be n-1 and no cycles.
- Try to union all edges; if any union finds endpoints already connected, there's a cycle -> not a tree.
- Given edges.size() == n-1 and no cycle, connectivity is guaranteed.

Complexity:
- Time: O(n + m α(n)) where m = edges.size() and α is inverse Ackermann (practically constant).
- Space: O(n) for DSU structures.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    int n1 = 5;
    std::vector<std::vector<int>> e1 = {{0,1},{0,2},{0,3},{1,4}};
    std::cout << std::boolalpha << sol.validTree(n1, e1) << "\n"; // true
    int n2 = 5;
    std::vector<std::vector<int>> e2 = {{0,1},{1,2},{2,3},{1,3},{1,4}};
    std::cout << std::boolalpha << sol.validTree(n2, e2) << "\n"; // false (cycle)
    return 0;
}
#endif