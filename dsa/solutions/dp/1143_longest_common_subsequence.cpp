/*
LeetCode 1143. Longest Common Subsequence
Link: https://leetcode.com/problems/longest-common-subsequence/

Question:
Given two strings text1 and text2, return the length of their longest common subsequence.

Constraints:
- 1 <= text1.length, text2.length <= 1000
- text1 and text2 consist of lowercase English characters

Approach (2D DP):
- dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1].
- Transition:
  - If text1[i-1] == text2[j-1], dp[i][j] = dp[i-1][j-1] + 1
  - Else dp[i][j] = max(dp[i-1][j], dp[i][j-1])
- Answer: dp[m][n]

Complexity:
- Time: O(m*n)
- Space: O(m*n)
*/

#include <vector>
#include <string>
#include <algorithm>

class Solution {
public:
    int longestCommonSubsequence(const std::string& text1, const std::string& text2) {
        int m = static_cast<int>(text1.size());
        int n = static_cast<int>(text2.size());
        std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (text1[i - 1] == text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = (dp[i - 1][j] > dp[i][j - 1]) ? dp[i - 1][j] : dp[i][j - 1];
                }
            }
        }
        return dp[m][n];
    }
};