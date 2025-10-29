/*
LeetCode 1091. Shortest Path in Binary Matrix
Link: https://leetcode.com/problems/shortest-path-in-binary-matrix/

Question:
Given an n x n binary matrix grid, return the length of the shortest clear path from top-left to
bottom-right. A clear path has only 0s, and moves can be in 8 directions (including diagonals).
If no such path exists, return -1.

Constraints:
- 1 <= n <= 100
- grid[i][j] ∈ {0, 1}

Approach (Layered BFS with 8 directions):
- If grid[0][0] or grid[n-1][n-1] is blocked (1), return -1 immediately.
- Perform BFS from (0,0) exploring 8-directional neighbors that are within bounds and equal to 0.
- Use a visited matrix to avoid revisiting cells.
- Count levels to determine path length.

Complexity:
- Time: O(n^2)
- Space: O(n^2)
*/

#include <vector>
#include <queue>

class Solution {
public:
    int shortestPathBinaryMatrix(std::vector<std::vector<int>>& grid) {
        int n = (int)grid.size();
        if (n == 0) return -1;
        if (grid[0][0] == 1 || grid[n-1][n-1] == 1) return -1;

        std::queue<std::pair<int,int>> q;
        std::vector<std::vector<char>> seen(n, std::vector<char>(n, 0));

        q.push({0,0});
        seen[0][0] = 1;

        // 8 directional moves
        static const int dr[8] = {-1,-1,-1,0,0,1,1,1};
        static const int dc[8] = {-1,0,1,-1,1,-1,0,1};

        int steps = 1;
        while (!q.empty()) {
            int sz = (int)q.size();
            for (int i = 0; i < sz; ++i) {
                auto cur = q.front();
                q.pop();
                int r = cur.first;
                int c = cur.second;
                if (r == n-1 && c == n-1) return steps;
                for (int k = 0; k < 8; ++k) {
                    int nr = r + dr[k];
                    int nc = c + dc[k];
                    if (nr >= 0 && nr < n && nc >= 0 && nc < n
                        && !seen[nr][nc] && grid[nr][nc] == 0) {
                        seen[nr][nc] = 1;
                        q.push({nr, nc});
                    }
                }
            }
            ++steps;
        }
        return -1;
    }
};