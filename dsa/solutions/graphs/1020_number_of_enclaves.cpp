/*
LeetCode 1020. Number of Enclaves
Link: https://leetcode.com/problems/number-of-enclaves/

Question:
Given an m x n binary grid, return the number of land cells from which we cannot walk off the boundary.
You can move up, down, left, or right. Cells with 1 are land, 0 water.

Constraints:
- m == grid.size, n == grid[0].size
- 1 <= m, n <= 500
- grid[i][j] ∈ {0,1}

Approach (Multi-source BFS from boundary land):
- Push all boundary land cells (value 1) into a queue and mark them as 0 (erode).
- BFS to erode all land connected to boundary.
- Count remaining 1s which are enclaves.

Complexity:
- Time: O(m*n)
- Space: O(m*n) in worst case
*/

#include <vector>
#include <queue>

class Solution {
public:
    int numberOfEnclaves(std::vector<std::vector<int>>& grid) {
        int m = (int)grid.size();
        if (m == 0) return 0;
        int n = (int)grid[0].size();
        std::queue<std::pair<int,int>> q;

        // Erode boundary-connected land
        for (int i = 0; i < m; ++i) {
            if (grid[i][0] == 1) { grid[i][0] = 0; q.push({i, 0}); }
            if (n > 1 && grid[i][n-1] == 1) { grid[i][n-1] = 0; q.push({i, n-1}); }
        }
        for (int j = 0; j < n; ++j) {
            if (grid[0][j] == 1) { grid[0][j] = 0; q.push({0, j}); }
            if (m > 1 && grid[m-1][j] == 1) { grid[m-1][j] = 0; q.push({m-1, j}); }
        }

        static const int dr[4] = {1, -1, 0, 0};
        static const int dc[4] = {0, 0, 1, -1};
        while (!q.empty()) {
            auto cur = q.front(); q.pop();
            int r = cur.first, c = cur.second;
            for (int k = 0; k < 4; ++k) {
                int nr = r + dr[k];
                int nc = c + dc[k];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1) {
                    grid[nr][nc] = 0;
                    q.push({nr, nc});
                }
            }
        }

        int count = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == 1) ++count;
            }
        }
        return count;
    }
};