/*
LeetCode 72. Edit Distance
Link: https://leetcode.com/problems/edit-distance/

Question:
Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.
You can perform insert a character, delete a character, or replace a character.

Constraints:
- 0 <= word1.length, word2.length <= 500
- word1 and word2 consist of lowercase English letters

Approach (2D DP - classic Levenshtein distance):
- dp[i][j] = min operations to convert first i chars of word1 into first j chars of word2.
- Base: dp[i][0] = i (delete all), dp[0][j] = j (insert all).
- Transition:
  - If word1[i-1] == word2[j-1]: dp[i][j] = dp[i-1][j-1]
  - Else: dp[i][j] = 1 + min(
      dp[i-1][j],    // delete word1[i-1]
      dp[i][j-1],    // insert word2[j-1]
      dp[i-1][j-1]   // replace word1[i-1] -> word2[j-1]
    )

Complexity:
- Time: O(m*n)
- Space: O(m*n)
*/

#include <vector>
#include <string>
#include <algorithm>

class Solution {
public:
    int minDistance(const std::string& word1, const std::string& word2) {
        int m = static_cast<int>(word1.size());
        int n = static_cast<int>(word2.size());
        std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));
        for (int i = 0; i <= m; ++i) dp[i][0] = i;
        for (int j = 0; j <= n; ++j) dp[0][j] = j;
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (word1[i - 1] == word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    int del = dp[i - 1][j];
                    int ins = dp[i][j - 1];
                    int rep = dp[i - 1][j - 1];
                    dp[i][j] = std::min(std::min(del, ins), rep) + 1;
                }
            }
        }
        return dp[m][n];
    }
};