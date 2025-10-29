/*
LeetCode 547. Number of Provinces
Link: https://leetcode.com/problems/number-of-provinces/

Question:
There are n cities. Some of them are connected, while some are not. If city a is connected directly to city b,
and city b is connected directly to city c, then city a is connected indirectly to city c.
A province is a group of directly or indirectly connected cities and no other cities outside of the group.
You are given an n x n matrix isConnected where isConnected[i][j] = 1 if the ith city and the jth city are directly connected,
and isConnected[i][j] = 0 otherwise. Return the total number of provinces.

Constraints:
- 1 <= n <= 200
- isConnected.length == n
- isConnected[i].length == n
- isConnected[i][j] is 0 or 1
- isConnected[i][i] == 1
*/

#include <vector>
#include <unordered_set>
#include <cstddef>

class Solution {
private:
    std::vector<int> parent;
    std::vector<int> rnk;

    int findp(int x) {
        if (parent[x] != x) parent[x] = findp(parent[x]);
        return parent[x];
    }

    void unite(int a, int b) {
        int pa = findp(a), pb = findp(b);
        if (pa == pb) return;
        if (rnk[pa] < rnk[pb]) {
            parent[pa] = pb;
        } else if (rnk[pa] > rnk[pb]) {
            parent[pb] = pa;
        } else {
            parent[pb] = pa;
            ++rnk[pa];
        }
    }

public:
    int findCircleNum(std::vector<std::vector<int>>& isConnected) {
        const int n = static_cast<int>(isConnected.size());
        if (n == 0) return 0;
        parent.resize(n);
        rnk.assign(n, 0);
        for (int i = 0; i < n; ++i) parent[i] = i;

        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (isConnected[i][j] == 1) unite(i, j);
            }
        }

        std::unordered_set<int> roots;
        for (int i = 0; i < n; ++i) {
            roots.insert(findp(i));
        }
        return static_cast<int>(roots.size());
    }
};

/*
Approach:
- Use Disjoint Set Union (Union-Find) to merge connected cities; the number of unique parents after unions is the number of provinces.

Complexity:
- Time: O(n^2 * α(n)) due to scanning the adjacency matrix and union operations (α is inverse Ackermann).
- Space: O(n) for DSU arrays.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    std::vector<std::vector<int>> A = {
        {1,1,0},
        {1,1,0},
        {0,0,1}
    };
    std::cout << sol.findCircleNum(A) << "\n"; // 2
    return 0;
}
#endif