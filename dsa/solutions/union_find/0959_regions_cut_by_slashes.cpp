/*
LeetCode 959. Regions Cut By Slashes
Link: https://leetcode.com/problems/regions-cut-by-slashes/

Question:
An n x n grid is divided by '/' and '\' characters. These slashes divide the grid into regions.
Return the number of regions.

Constraints:
- 1 <= n <= 30
- grid.length == n
- grid[i].length == n
- grid[i][j] is either '/' or '\' or ' ' (a blank space)
*/

#include <vector>
#include <string>
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
    int regionsBySlashes(std::vector<std::string>& grid) {
        int n = static_cast<int>(grid.size());
        if (n == 0) return 0;
        // Each cell -> 4 subcells: 0:top, 1:right, 2:bottom, 3:left
        int total = n * n * 4;
        parent.resize(total);
        rnk.assign(total, 0);
        for (int i = 0; i < total; ++i) parent[i] = i;

        auto id = [&](int r, int c, int k) {
            return (r * n + c) * 4 + k;
        };

        for (int r = 0; r < n; ++r) {
            for (int c = 0; c < n; ++c) {
                char ch = grid[r][c];
                int t = id(r, c, 0);
                int ri = id(r, c, 1);
                int b = id(r, c, 2);
                int l = id(r, c, 3);

                if (ch == ' ') {
                    // merge all four
                    unite(t, ri);
                    unite(ri, b);
                    unite(b, l);
                } else if (ch == '/') {
                    // slash divides: top with left, bottom with right
                    unite(t, l);
                    unite(ri, b);
                } else if (ch == '\\') {
                    // backslash divides: top with right, bottom with left
                    unite(t, ri);
                    unite(b, l);
                }

                // Connect with neighbors
                if (r + 1 < n) {
                    // bottom of current with top of below
                    unite(b, id(r + 1, c, 0));
                }
                if (c + 1 < n) {
                    // right of current with left of right-neighbor
                    unite(ri, id(r, c + 1, 3));
                }
            }
        }

        std::unordered_set<int> regions;
        regions.reserve(static_cast<std::size_t>(total));
        for (int i = 0; i < total; ++i) {
            regions.insert(findp(i));
        }
        return static_cast<int>(regions.size());
    }
};

/*
Approach:
- Model each grid cell as 4 subcells (top, right, bottom, left). Unite subcells within a cell depending on the slash:
  ' ' => all 4 unified; '/' => {top,left} and {right,bottom}; '\' => {top,right} and {bottom,left}.
- Unite adjacent subcells across neighboring cells: bottom with top of below, right with left of the right neighbor.
- The number of unique DSU parents across all subcells equals the number of regions.

Complexity:
- Time: O(n^2 * α(n^2)) for unions over 4 subcells per cell and neighbor connections.
- Space: O(n^2) for DSU arrays.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    std::vector<std::string> g = {
        " /",
        "/ "
    };
    std::cout << sol.regionsBySlashes(g) << "\n"; // 2
    return 0;
}
#endif