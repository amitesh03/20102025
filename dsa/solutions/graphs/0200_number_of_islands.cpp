/*
LeetCode 200. Number of Islands
Link: https://leetcode.com/problems/number-of-islands/

Question:
Given a 2D grid map of '1's (land) and '0's (water), count the number of islands.
An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.

Constraints:
- m == grid.size, n == grid[i].size
- 1 <= m,n <= 300
- grid[i][j] ∈ {'0','1'}

Approach (BFS flood fill):
- Iterate cells; when a '1' is found, increment count and BFS to mark the entire island as visited by turning to '0'.
- Use a queue and 4-directional neighbors within bounds.

Complexity:
- Time: O(m*n)
- Space: O(min(m*n)) for queue in worst case island size
*/

#include <vector>
#include <queue>

class Solution {
public:
    int numIslands(std::vector<std::vector<char>>& grid) {
        int m = (int)grid.size();
        if (m == 0) return 0;
        int n = (int)grid[0].size();
        int count = 0;

        std::queue<std::pair<int,int>> q;
        static const int dr[4] = {1, -1, 0, 0};
        static const int dc[4] = {0, 0, 1, -1};

        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == '1') {
                    ++count;
                    grid[i][j] = '0';
                    q.push({i, j});
                    while (!q.empty()) {
                        auto cur = q.front();
                        q.pop();
                        int r = cur.first;
                        int c = cur.second;
                        for (int k = 0; k < 4; ++k) {
                            int nr = r + dr[k];
                            int nc = c + dc[k];
                            if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == '1') {
                                grid[nr][nc] = '0';
                                q.push({nr, nc});
                            }
                        }
                    }
                }
            }
        }
        return count;
    }
};