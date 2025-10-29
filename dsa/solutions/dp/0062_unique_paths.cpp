/*
LeetCode 62. Unique Paths
Link: https://leetcode.com/problems/unique-paths/

Question:
A robot is located at the top-left corner of a m x n grid (marked 'Start').
The robot can only move either down or right at any point in time.
The robot is trying to reach the bottom-right corner of the grid (marked 'Finish').
How many possible unique paths are there?

Constraints:
- 1 <= m, n <= 100

Approach (1D DP):
- Use 1D dp of size n where dp[j] is paths to current row at column j.
- Initialize first row with 1s. For each row i>=1, update dp[j] += dp[j-1].
- Answer is dp[n-1].

Complexity:
- Time: O(m*n)
- Space: O(n)
*/

#include <vector>

class Solution {
public:
    int uniquePaths(int m, int n) {
        if (m <= 0 || n <= 0) return 0;
        std::vector<int> dp(n, 1);
        for (int i = 1; i < m; ++i) {
            for (int j = 1; j < n; ++j) {
                dp[j] += dp[j - 1];
            }
        }
        return dp[n - 1];
    }
};