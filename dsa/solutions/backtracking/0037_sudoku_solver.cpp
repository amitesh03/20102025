/*
LeetCode 37. Sudoku Solver
Link: https://leetcode.com/problems/sudoku-solver/

Question:
Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all rules:
- Each digit 1-9 must occur exactly once in each row.
- Each digit 1-9 must occur exactly once in each column.
- Each digit 1-9 must occur exactly once in each of the nine 3x3 sub-boxes.
The '.' character indicates empty cells.

Constraints:
- board.length == 9
- board[i].length == 9
- board[i][j] is '1'..'9' or '.'
- It is guaranteed the input board has a single solution.

Approach (Backtracking with bit masks):
- Track used digits for each row, column, and 3x3 box via 9-bit masks (bits 0..8).
- Pre-scan the board to initialize masks and collect coordinates of empty cells.
- DFS over the list of empties: for cell (r,c), try all digits whose bit is not set in row/col/box masks.
- Place digit, recurse, and backtrack if needed. Guaranteed solvable, so the search finishes.

Complexity:
- Time: Exponential worst-case, but fast in practice for valid instances
- Space: O(1) extra (fixed-size masks) plus recursion stack
*/

#include <vector>
#include <utility>

class Solution {
public:
    void solveSudoku(std::vector<std::vector<char>>& board) {
        init(board);
        dfs(board, 0);
    }

private:
    int rowMask[9] = {0};
    int colMask[9] = {0};
    int boxMask[9] = {0};
    std::vector<std::pair<int,int>> empties;

    static inline int boxIndex(int r, int c) {
        return (r / 3) * 3 + (c / 3);
    }

    void init(const std::vector<std::vector<char>>& board) {
        empties.clear();
        for (int r = 0; r < 9; ++r) {
            for (int c = 0; c < 9; ++c) {
                char ch = board[r][c];
                if (ch == '.') {
                    empties.emplace_back(r, c);
                } else {
                    int d = ch - '1';
                    int bit = 1 << d;
                    rowMask[r] |= bit;
                    colMask[c] |= bit;
                    boxMask[boxIndex(r, c)] |= bit;
                }
            }
        }
    }

    bool dfs(std::vector<std::vector<char>>& board, int idx) {
        if (idx == static_cast<int>(empties.size())) return true;
        int r = empties[idx].first;
        int c = empties[idx].second;
        int used = rowMask[r] | colMask[c] | boxMask[boxIndex(r, c)];
        for (int d = 0; d < 9; ++d) {
            int bit = 1 << d;
            if (used & bit) continue;

            // place digit
            board[r][c] = static_cast<char>('1' + d);
            rowMask[r] |= bit;
            colMask[c] |= bit;
            int b = boxIndex(r, c);
            boxMask[b] |= bit;

            if (dfs(board, idx + 1)) return true;

            // backtrack
            board[r][c] = '.';
            rowMask[r] &= ~bit;
            colMask[c] &= ~bit;
            boxMask[b] &= ~bit;
        }
        return false;
    }
};