/*
LeetCode 329. Longest Increasing Path in a Matrix
Link: https://leetcode.com/problems/longest-increasing-path-in-a-matrix/

Question:
Given an m x n integers matrix, return the length of the longest increasing path in matrix.
From each cell, you can move in four directions: left, right, up, or down. You may not move diagonally or move outside the boundary.

Constraints:
- m == matrix.length
- n == matrix[i].length
- 1 <= m, n <= 200
- 0 <= matrix[i][j] <= 2 * 10^9

Approach (DFS + Memoization):
- For each cell (i, j), perform a DFS to the four neighbors with strictly larger value.
- Memoize the best length starting from (i, j) to avoid recomputation.
- The answer is the maximum memoized value across all cells.
- This treats the grid as a DAG under the "increasing" relation; DFS with memo is O(m*n).

Complexity:
- Time: O(m * n) since each cell's DFS is computed once and cached
- Space: O(m * n) for memo and recursion stack
*/

#include <vector>
#include <algorithm>

class Solution {
private:
    int m, n;
    std::vector<std::vector<int>> memo;

    int dfs(const std::vector<std::vector<int>>& matrix, int i, int j) {
        int& cached = memo[i][j];
        if (cached != 0) return cached;

        static const int DIRS[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
        int best = 1; // path includes (i, j)
        for (int d = 0; d < 4; ++d) {
            int ni = i + DIRS[d][0];
            int nj = j + DIRS[d][1];
            if (ni >= 0 && ni < m && nj >= 0 && nj < n && matrix[ni][nj] > matrix[i][j]) {
                int cand = 1 + dfs(matrix, ni, nj);
                if (cand > best) best = cand;
            }
        }
        cached = best;
        return best;
    }

public:
    int longestIncreasingPath(std::vector<std::vector<int>>& matrix) {
        m = (int)matrix.size();
        n = (int)matrix[0].size();
        memo.assign(m, std::vector<int>(n, 0));

        int ans = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                int len = dfs(matrix, i, j);
                if (len > ans) ans = len;
            }
        }
        return ans;
    }
};