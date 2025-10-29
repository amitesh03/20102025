/*
LeetCode 417. Pacific Atlantic Water Flow
Link: https://leetcode.com/problems/pacific-atlantic-water-flow/

Question:
Given an m x n matrix of heights, return a list of grid coordinates where water can flow to both
the Pacific and Atlantic oceans. Water can flow from a cell to another one with height less than or
equal to the current cell's height, moving up, down, left, or right.

Constraints:
- m == heights.size, n == heights[0].size
- 1 <= m, n <= 200
- 0 <= heights[i][j] <= 10^5

Approach (Reverse BFS from ocean borders):
- Perform BFS starting from all Pacific-border cells simultaneously, flowing to neighbors that are
  equal or higher (reverse reachability).
- Similarly, perform BFS from all Atlantic-border cells.
- Cells visited by both BFS traversals can reach both oceans; collect them.

Complexity:
- Time: O(m*n)
- Space: O(m*n)
*/

#include <vector>
#include <queue>
#include <utility>

class Solution {
private:
    void bfsFill(const std::vector<std::vector<int>>& h,
                 std::vector<std::vector<char>>& vis,
                 const std::vector<std::pair<int,int>>& starts) {
        int m = (int)h.size();
        int n = (int)h[0].size();
        std::queue<std::pair<int,int>> q;
        for (size_t i = 0; i < starts.size(); ++i) {
            int r = starts[i].first;
            int c = starts[i].second;
            if (!vis[r][c]) {
                vis[r][c] = 1;
                q.push({r, c});
            }
        }
        static const int dr[4] = {1, -1, 0, 0};
        static const int dc[4] = {0, 0, 1, -1};
        while (!q.empty()) {
            auto cur = q.front(); q.pop();
            int r = cur.first, c = cur.second;
            for (int k = 0; k < 4; ++k) {
                int nr = r + dr[k];
                int nc = c + dc[k];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    if (!vis[nr][nc] && h[nr][nc] >= h[r][c]) {
                        vis[nr][nc] = 1;
                        q.push({nr, nc});
                    }
                }
            }
        }
    }
public:
    std::vector<std::vector<int>> pacificAtlantic(std::vector<std::vector<int>>& heights) {
        int m = (int)heights.size();
        if (m == 0) return {};
        int n = (int)heights[0].size();

        std::vector<std::vector<char>> pac(m, std::vector<char>(n, 0));
        std::vector<std::vector<char>> atl(m, std::vector<char>(n, 0));

        std::vector<std::pair<int,int>> pacStarts;
        pacStarts.reserve(m + n);
        std::vector<std::pair<int,int>> atlStarts;
        atlStarts.reserve(m + n);

        // Pacific borders: top row and left column
        for (int j = 0; j < n; ++j) pacStarts.push_back({0, j});
        for (int i = 0; i < m; ++i) pacStarts.push_back({i, 0});

        // Atlantic borders: bottom row and right column
        for (int j = 0; j < n; ++j) atlStarts.push_back({m - 1, j});
        for (int i = 0; i < m; ++i) atlStarts.push_back({i, n - 1});

        bfsFill(heights, pac, pacStarts);
        bfsFill(heights, atl, atlStarts);

        std::vector<std::vector<int>> res;
        res.reserve(m * n);
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (pac[i][j] && atl[i][j]) {
                    res.push_back({i, j});
                }
            }
        }
        return res;
    }
};