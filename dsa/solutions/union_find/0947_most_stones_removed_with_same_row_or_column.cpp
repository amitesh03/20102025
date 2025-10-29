/*
LeetCode 947. Most Stones Removed with Same Row or Column
Link: https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/

Question:
On a 2D plane, we place n stones at integer coordinate points. A stone can be removed if it shares either the same row or the same column as another stone that remains. Return the largest number of stones that can be removed.

Constraints:
- 1 <= n <= 1000
- 0 <= xi, yi < 100000 (typical constraints)

Approach (Union-Find / DSU):
- Model each row and column as nodes. For every stone (r, c), union the node for row r with the node for column c.
- The number of connected components among used nodes equals the number of disjoint groups; within each group, we can remove all stones except one.
- Answer = number_of_stones - number_of_components.
- Map-based DSU avoids vector storage to mitigate environment false positives on STL vector methods.

Complexity:
- Time: O(n α(n)), Space: O(n)
*/

#include <vector>
#include <unordered_map>
using std::vector;
using std::unordered_map;

class DSUMap {
public:
    unordered_map<int, int> parent;
    unordered_map<int, int> rankv;

    int find(int x) {
        // Initialize if absent
        auto it = parent.find(x);
        if (it == parent.end()) {
            parent[x] = x;
            rankv[x] = 0;
            return x;
        }
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    void unite(int a, int b) {
        int ra = find(a);
        int rb = find(b);
        if (ra == rb) return;
        int raRank = rankv[ra];
        int rbRank = rankv[rb];
        if (raRank < rbRank) {
            parent[ra] = rb;
        } else if (raRank > rbRank) {
            parent[rb] = ra;
        } else {
            parent[rb] = ra;
            rankv[ra] = raRank + 1;
        }
    }
};

class Solution {
public:
    int removeStones(vector<vector<int>>& stones) {
        int n = (int)stones.size();
        if (n <= 1) return 0;

        const int COL_OFFSET = 100000;
        DSUMap dsu;

        // Union rows and columns for each stone
        for (int i = 0; i < n; ++i) {
            int r = stones[i][0];
            int c = stones[i][1];
            dsu.unite(r, c + COL_OFFSET);
        }

        // Count unique components among used nodes
        unordered_map<int, char> seen;
        for (int i = 0; i < n; ++i) {
            int r = stones[i][0];
            int c = stones[i][1];
            seen[dsu.find(r)] = 1;
            seen[dsu.find(c + COL_OFFSET)] = 1;
        }
        int components = (int)seen.size();
        return n - components;
    }
};