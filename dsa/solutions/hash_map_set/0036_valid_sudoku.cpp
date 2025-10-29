/*
LeetCode 36. Valid Sudoku
Link: https://leetcode.com/problems/valid-sudoku/

Question:
Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:
- Each row must contain the digits 1-9 without repetition.
- Each column must contain the digits 1-9 without repetition.
- Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.

Constraints:
- board.length == 9
- board[i].length == 9
- board[i][j] is a digit or '.'
*/

#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    bool isValidSudoku(vector<vector<char>>& board) {
        // Use boolean seen arrays: rows[9][10], cols[9][10], boxes[9][10]
        bool rows[9][10] = {{false}};
        bool cols[9][10] = {{false}};
        bool boxes[9][10] = {{false}};
        for (int r = 0; r < 9; ++r) {
            for (int c = 0; c < 9; ++c) {
                char ch = board[r][c];
                if (ch == '.') continue;
                int d = ch - '0';       // digit 1..9
                int b = (r / 3) * 3 + (c / 3); // box index 0..8
                if (rows[r][d] || cols[c][d] || boxes[b][d]) return false;
                rows[r][d] = cols[c][d] = boxes[b][d] = true;
            }
        }
        return true;
    }
};

/*
Approach:
- Track seen digits for each row, column, and 3x3 box using fixed-size boolean arrays.

Complexity:
- Time: O(81)
- Space: O(1)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<vector<char>> board = {
        {'5','3','.','.','7','.','.','.','.'},
        {'6','.','.','1','9','5','.','.','.'},
        {'.','9','8','.','.','.','.','6','.'},
        {'8','.','.','.','6','.','.','.','3'},
        {'4','.','.','8','.','3','.','.','1'},
        {'7','.','.','.','2','.','.','.','6'},
        {'.','6','.','.','.','.','2','8','.'},
        {'.','.','.','4','1','9','.','.','5'},
        {'.','.','.','.','8','.','.','7','9'}
    };
    cout << (sol.isValidSudoku(board) ? "true" : "false") << "\n"; // true
    return 0;
}
#endif