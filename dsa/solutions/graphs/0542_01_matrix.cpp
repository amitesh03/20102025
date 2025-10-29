/*
LeetCode 542. 01 Matrix
Link: https://leetcode.com/problems/01-matrix/

Question:
Given an m x n binary matrix mat, return the distance of the nearest 0 for each cell.
The distance between two adjacent cells is 1.

Constraints:
- m == mat.size, n == mat[0].size
- 1 <= m, n <= 10^4 across total cells, 1 <= m*n <= 10^5
- mat[i][j] is 0 or 1

Approach (Multi-source BFS from zeros):
- Initialize queue with all zero cells and set their distance to 0.
- Set all ones' distance to -1 (unvisited).
- BFS layer-by-layer; when visiting a neighbor with distance -1, set it to dist[cur]+1 and enqueue.

Complexity:
- Time: O(m*n)
- Space: O(m*n)
*/

#include <vector>
#include <queue>

class Solution {
public:
    std::vector<std::vector<int>> updateMatrix(std::vector<std::vector<int>>& mat) {
        int m = (int)mat.size();
        if (m == 0) return {};
        int n = (int)mat[0].size();
        std::vector<std::vector<int>> dist(m, std::vector<int>(n, -1));
        std::queue<std::pair<int,int>> q;

        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (mat[i][j] == 0) {
                    dist[i][j] = 0;
                    q.push({i, j});
                }
            }
        }

        static const int dr[4] = {1, -1, 0, 0};
        static const int dc[4] = {0, 0, 1, -1};

        while (!q.empty()) {
            auto cur = q.front(); q.pop();
            int r = cur.first;
            int c = cur.second;
            for (int k = 0; k < 4; ++k) {
                int nr = r + dr[k];
                int nc = c + dc[k];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && dist[nr][nc] == -1) {
                    dist[nr][nc] = dist[r][c] + 1;
                    q.push({nr, nc});
                }
            }
        }
        return dist;
    }
};