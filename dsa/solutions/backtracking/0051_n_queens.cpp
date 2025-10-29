/*
LeetCode 51. N-Queens
Link: https://leetcode.com/problems/n-queens/

Question:
Place n queens on an n x n chessboard so that no two queens attack each other.
Return all distinct solutions, where each solution consists of n strings of length n,
with 'Q' for a queen and '.' for empty.

Constraints:
- 1 <= n <= 9

Approach (Backtracking with column and diagonal occupancy):
- Build the board row by row.
- Track used columns, main diagonals (r - c), and anti-diagonals (r + c) via boolean arrays.
- For each row, try columns that are not under attack; place 'Q', recurse, then backtrack.

Complexity:
- Time: exponential in n (solutions count grows non-trivially)
- Space: O(n) recursion depth + O(n^2) for the board representation (excluding output)
*/

#include <vector>
#include <string>

class Solution {
public:
    std::vector<std::vector<std::string>> solveNQueens(int n) {
        std::vector<std::vector<std::string>> res;
        std::vector<std::string> board(n, std::string(n, '.'));
        std::vector<char> col(n, 0);
        std::vector<char> diag1(2 * n - 1, 0); // r - c shifted by + (n-1)
        std::vector<char> diag2(2 * n - 1, 0); // r + c
        backtrack(0, n, board, col, diag1, diag2, res);
        return res;
    }

private:
    void backtrack(int r, int n,
                   std::vector<std::string>& board,
                   std::vector<char>& col,
                   std::vector<char>& diag1,
                   std::vector<char>& diag2,
                   std::vector<std::vector<std::string>>& res) {
        if (r == n) {
            res.push_back(board);
            return;
        }
        for (int c = 0; c < n; ++c) {
            int d1 = r - c + (n - 1);
            int d2 = r + c;
            if (col[c] || diag1[d1] || diag2[d2]) continue;
            // place
            board[r][c] = 'Q';
            col[c] = diag1[d1] = diag2[d2] = 1;
            backtrack(r + 1, n, board, col, diag1, diag2, res);
            // remove
            board[r][c] = '.';
            col[c] = diag1[d1] = diag2[d2] = 0;
        }
    }
};