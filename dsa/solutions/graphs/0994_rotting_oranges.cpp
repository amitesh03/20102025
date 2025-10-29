/*
LeetCode 994. Rotting Oranges
Link: https://leetcode.com/problems/rotting-oranges/

Question:
You are given an m x n grid where each cell can be:
0 -> empty, 1 -> fresh orange, 2 -> rotten orange.
Each minute, any fresh orange that is adjacent (up, down, left, right) to a rotten orange becomes rotten.
Return the minimum number of minutes to rot all oranges, or -1 if impossible.

Constraints:
- m == grid.size, n == grid[0].size
- 1 <= m, n <= 10^2

Approach (Multi-source BFS):
- Push all initially rotten oranges into a queue.
- Count total fresh oranges.
- Perform BFS in layers; each layer represents one minute.
- When spreading to adjacent fresh oranges, decrement fresh count and mark as rotten.
- Answer is the number of layers processed until no more spread; if fresh remain, return -1.

Complexity:
- Time: O(m*n)
- Space: O(m*n)
*/

#include <vector>
#include <queue>

class Solution {
public:
    int orangesRotting(std::vector<std::vector<int>>& grid) {
        int m = (int)grid.size();
        if (m == 0) return 0;
        int n = (int)grid[0].size();

        std::queue<std::pair<int,int>> q;
        int fresh = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == 2) {
                    q.push({i, j});
                } else if (grid[i][j] == 1) {
                    ++fresh;
                }
            }
        }

        if (fresh == 0) return 0;

        static const int dr[4] = {1, -1, 0, 0};
        static const int dc[4] = {0, 0, 1, -1};

        int minutes = 0;
        while (!q.empty()) {
            int sz = (int)q.size();
            bool progressed = false;
            for (int t = 0; t < sz; ++t) {
                auto cur = q.front();
                q.pop();
                int r = cur.first;
                int c = cur.second;
                for (int k = 0; k < 4; ++k) {
                    int nr = r + dr[k];
                    int nc = c + dc[k];
                    if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        --fresh;
                        q.push({nr, nc});
                        progressed = true;
                    }
                }
            }
            if (progressed) ++minutes;
        }

        return fresh == 0 ? minutes : -1;
    }
};