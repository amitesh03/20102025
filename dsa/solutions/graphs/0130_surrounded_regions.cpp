/*
LeetCode 130. Surrounded Regions
Link: https://leetcode.com/problems/surrounded-regions/

Question:
Given an m x n matrix board containing 'X' and 'O', capture all regions that are 4-directionally
surrounded by 'X'. A region is captured by flipping all 'O's into 'X's in that surrounded region.

Constraints:
- m == board.size, n == board[0].size
- 1 <= m, n <= 200
- board[i][j] is 'X' or 'O'

Approach (Border BFS Flood Fill):
- Any 'O' connected to the border (top row, bottom row, left column, right column) cannot be captured.
- Perform BFS starting from all border 'O' cells, marking them temporarily as '#'.
- After the BFS completes, every remaining 'O' is enclosed and should be flipped to 'X'.
- Finally, turn all '#' back to 'O'.

Complexity:
- Time: O(m * n)
- Space: O(m * n) in the worst case for the BFS queue
*/

#include <vector>
#include <queue>
#include <utility>

class Solution {
public:
    void solve(std::vector<std::vector<char>>& board) {
        int m = (int)board.size();
        if (m == 0) return;
        int n = (int)board[0].size();
        if (n == 0) return;

        std::queue<std::pair<int,int>> q;

        auto push_if_O = [&](int r, int c) {
            if (r >= 0 && r < m && c >= 0 && c < n && board[r][c] == 'O') {
                board[r][c] = '#';
                q.push({r, c});
            }
        };

        // Add all border 'O's to the queue and mark as '#'
        for (int j = 0; j < n; ++j) {
            push_if_O(0, j);
            push_if_O(m - 1, j);
        }
        for (int i = 0; i < m; ++i) {
            push_if_O(i, 0);
            push_if_O(i, n - 1);
        }

        static const int dr[4] = {1, -1, 0, 0};
        static const int dc[4] = {0, 0, 1, -1};

        // BFS to mark all 'O's connected to any border 'O'
        while (!q.empty()) {
            auto cur = q.front(); q.pop();
            int r = cur.first, c = cur.second;
            for (int k = 0; k < 4; ++k) {
                int nr = r + dr[k];
                int nc = c + dc[k];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] == 'O') {
                    board[nr][nc] = '#';
                    q.push({nr, nc});
                }
            }
        }

        // Flip enclosed 'O' -> 'X', and restore '#' -> 'O'
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (board[i][j] == 'O') board[i][j] = 'X';
                else if (board[i][j] == '#') board[i][j] = 'O';
            }
        }
    }
};