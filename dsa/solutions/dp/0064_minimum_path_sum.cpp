/*
LeetCode 64. Minimum Path Sum
Link: https://leetcode.com/problems/minimum-path-sum/

Question:
Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right,
which minimizes the sum of all numbers along its path. You can only move either down or right at any point in time.

Constraints:
- 1 <= m, n <= 200
- 0 <= grid[i][j] <= 200

Approach (1D DP):
- Use a 1D DP array dp of size n where dp[j] stores the min path sum to the current cell in the current row.
- Initialize first row cumulatively. For each next row:
  - Update dp[0] by adding the current cell (only down moves possible at first column),
  - For j >= 1, dp[j] = min(dp[j] (from top), dp[j-1] (from left)) + grid[i][j].

Complexity:
- Time: O(m*n)
- Space: O(n)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    int minPathSum(std::vector<std::vector<int>>& grid) {
        int m = static_cast<int>(grid.size());
        int n = static_cast<int>(grid[0].size());
        std::vector<int> dp(n, 0);
        dp[0] = grid[0][0];
        for (int j = 1; j < n; ++j) dp[j] = dp[j - 1] + grid[0][j];
        for (int i = 1; i < m; ++i) {
            dp[0] += grid[i][0];
            for (int j = 1; j < n; ++j) {
                dp[j] = std::min(dp[j], dp[j - 1]) + grid[i][j];
            }
        }
        return dp[n - 1];
    }
};