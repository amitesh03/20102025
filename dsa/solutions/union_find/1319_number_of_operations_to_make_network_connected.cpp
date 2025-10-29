/*
LeetCode 1319. Number of Operations to Make Network Connected
Link: https://leetcode.com/problems/number-of-operations-to-make-network-connected/

Question:
You are given a network of n computers labeled from 0 to n - 1 and an integer n. You are also given connections,
where connections[i] = [ai, bi] represents a connection between computers ai and bi.
Any computer can reach any other computer directly or indirectly through the network.

Return the minimum number of operations needed to make all computers connected. If it is impossible, return -1.
You can use an operation to connect two computers that are not connected.

Constraints:
- 1 <= n <= 10^5
- 0 <= connections.length <= 10^5
- connections[i].length == 2
- 0 <= ai, bi < n
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
    int makeConnected(int n, std::vector<std::vector<int>>& connections) {
        // Need at least n-1 cables to connect n computers
        if (static_cast<int>(connections.size()) < n - 1) return -1;
        parent.resize(n);
        rnk.assign(n, 0);
        for (int i = 0; i < n; ++i) parent[i] = i;
        for (std::size_t i = 0; i < connections.size(); ++i) {
            int a = connections[i][0];
            int b = connections[i][1];
            if (a < 0 || a >= n || b < 0 || b >= n) continue;
            unite(a, b);
        }
        std::unordered_set<int> roots;
        for (int i = 0; i < n; ++i) {
            roots.insert(findp(i));
        }
        return static_cast<int>(roots.size()) - 1;
    }
};

/*
Approach:
- If there are fewer than n-1 cables, it's impossible -> return -1.
- Use DSU to union all connected pairs; count number of connected components (unique roots).
- Minimum operations equals components - 1.

Complexity:
- Time: O(n + m * α(n)), m = connections.size()
- Space: O(n)
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    int n1 = 4;
    std::vector<std::vector<int>> c1 = {{0,1},{0,2},{1,2}};
    std::cout << sol.makeConnected(n1, c1) << "\n"; // 1
    int n2 = 6;
    std::vector<std::vector<int>> c2 = {{0,1},{0,2},{0,3},{1,2},{1,3}};
    std::cout << sol.makeConnected(n2, c2) << "\n"; // 2
    return 0;
}
#endif