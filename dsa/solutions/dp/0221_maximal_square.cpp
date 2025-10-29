/*
LeetCode 221. Maximal Square
Link: https://leetcode.com/problems/maximal-square/

Question:
Given an m x n binary matrix filled with '0's and '1's, find the largest square containing only '1's and return its area.

Constraints:
- 1 <= m, n <= 300
- matrix[i][j] is '0' or '1'

Approach (1D DP with rolling value):
- Let dp[j] represent the size of the largest square ending at the current row and column j (1-indexed for DP).
- Iterate rows i = 1..m and columns j = 1..n:
  - Keep prev = dp[j-1] from previous row (top-left) using a temporary variable.
  - If matrix[i-1][j-1] == '1':
      dp[j] = min(dp[j] (top), dp[j-1] (left), prev (top-left)) + 1
    Else:
      dp[j] = 0
- Track maxSide; return maxSide * maxSide (area).

Complexity:
- Time: O(m * n)
- Space: O(n)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    int maximalSquare(std::vector<std::vector<char>>& matrix) {
        int m = static_cast<int>(matrix.size());
        if (m == 0) return 0;
        int n = static_cast<int>(matrix[0].size());
        std::vector<int> dp(n + 1, 0);
        int maxSide = 0;
        for (int i = 1; i <= m; ++i) {
            int prev = 0; // dp[j-1] from previous row (top-left)
            for (int j = 1; j <= n; ++j) {
                int temp = dp[j]; // store dp[j] (top) before overwrite
                if (matrix[i - 1][j - 1] == '1') {
                    dp[j] = std::min(std::min(dp[j], dp[j - 1]), prev) + 1;
                    if (dp[j] > maxSide) maxSide = dp[j];
                } else {
                    dp[j] = 0;
                }
                prev = temp;
            }
        }
        return maxSide * maxSide;
    }
};