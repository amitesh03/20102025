/*
LeetCode 685. Redundant Connection II
Link: https://leetcode.com/problems/redundant-connection-ii/

Question:
In a directed graph with n nodes labeled 1..n, we are given n edges forming a graph that started as a rooted tree
(with exactly one root and every node has exactly one parent except the root) then had one extra edge added.
Remove one edge to make the resulting graph a rooted tree. If multiple answers exist, return the edge that occurs last
in the input list.

Constraints:
- 2 <= n <= 1000
- nodes labeled 1..n
- edges.size() == n

Approach (Two-parent detection + DSU cycle check):
- There are two possible invalidities introduced by the extra edge:
  1) A node with two parents (in-degree 2)
  2) A cycle
- First pass: find if any node has two parents by tracking parent[v]. If so, record the two candidate edges candA (first parent->v)
  and candB (second parent->v). Temporarily "remove" candB for cycle checking.
- Second pass: run DSU on all edges (skip candB if it exists). If a cycle occurs:
  - If a two-parent case exists, return candA (the first parent edge to the child).
  - Otherwise, return the current edge causing the cycle.
- If no cycle occurs in the DSU pass and we had two-parent case, return candB (the second parent edge).

Complexity:
- Time: O(n α(n)), Space: O(n)
*/

#include <vector>
using std::vector;

struct DSU {
    vector<int> parent;
    vector<int> rankv;
    DSU(int n) : parent(n + 1), rankv(n + 1, 0) {
        for (int i = 0; i <= n; ++i) parent[i] = i;
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (rankv[a] < rankv[b]) {
            parent[a] = b;
        } else if (rankv[a] > rankv[b]) {
            parent[b] = a;
        } else {
            parent[b] = a;
            ++rankv[a];
        }
        return true;
    }
};

class Solution {
public:
    vector<int> findRedundantDirectedConnection(vector<vector<int>>& edges) {
        int n = (int)edges.size();
        vector<int> parent(n + 1, 0);
        vector<int> candA, candB;

        // Step 1: detect node with two parents
        for (const auto& e : edges) {
            int u = e[0], v = e[1];
            if (parent[v] == 0) {
                parent[v] = u;
            } else {
                // v has two parents: record first (candA) and second (candB)
                candA = { parent[v], v };
                candB = { u, v };
                // Mark to ignore candB in DSU cycle check by clearing its child parent
                // We don't modify edges here; we will skip candB when unioning.
                break;
            }
        }

        // Step 2: DSU to detect cycle, skipping candB if exists
        DSU dsu(n);
        for (const auto& e : edges) {
            if (!candB.empty() && e[0] == candB[0] && e[1] == candB[1]) {
                // skip candB
                continue;
            }
            int u = e[0], v = e[1];
            if (!dsu.unite(u, v)) {
                // Cycle found
                if (!candA.empty()) {
                    // Two-parent case + cycle => remove candA
                    return candA;
                }
                // Pure cycle case
                return { u, v };
            }
        }

        // No cycle detected with candB removed => remove candB to resolve two-parent
        if (!candB.empty()) return candB;

        // Fallback (should not reach here per problem constraints)
        return {};
    }
};