/*
LeetCode 79. Word Search
Link: https://leetcode.com/problems/word-search/

Question:
Given an m x n grid of characters board and a string word, return true if word exists in the grid.
The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.
The same letter cell may not be used more than once.

Constraints:
- 1 <= m, n <= 6
- 1 <= word.length <= 15
- board[i][j] is a lowercase English letter.

Approach (Backtracking DFS):
- Try starting from every cell that matches word[0].
- DFS with index k for current character; mark cell as visited by temporarily altering board[i][j].
- Explore 4 directions; restore cell on backtrack.
- Early exit as soon as the full word is matched.

Complexity:
- Time: O(m * n * 4^L) worst-case, where L = word.length
- Space: O(L) recursion depth
*/

#include <vector>
#include <string>

class Solution {
public:
    bool exist(std::vector<std::vector<char>>& board, std::string word) {
        m = static_cast<int>(board.size());
        n = static_cast<int>(board[0].size());
        this->word = &word;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (board[i][j] == (*this->word)[0]) {
                    if (dfs(board, i, j, 0)) return true;
                }
            }
        }
        return false;
    }

private:
    int m = 0, n = 0;
    const std::string* word = nullptr;

    bool dfs(std::vector<std::vector<char>>& board, int i, int j, int k) {
        if (i < 0 || i >= m || j < 0 || j >= n) return false;
        if (board[i][j] != (*word)[k]) return false;
        if (k == static_cast<int>(word->size()) - 1) return true;

        char saved = board[i][j];
        board[i][j] = '#'; // mark visited

        static const int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
        for (int t = 0; t < 4; ++t) {
            int ni = i + dirs[t][0];
            int nj = j + dirs[t][1];
            if (dfs(board, ni, nj, k + 1)) {
                board[i][j] = saved;
                return true;
            }
        }

        board[i][j] = saved;
        return false;
    }
};