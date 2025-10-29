/*
LeetCode 518. Coin Change II
Link: https://leetcode.com/problems/coin-change-ii/

Question:
You are given an integer array coins and an integer amount representing a total amount of money.
Return the number of combinations that make up that amount. You may assume that you have an infinite number of each kind of coin.
Order of coins does not matter; different permutations are the same combination.

Constraints:
- 1 <= coins.length <= 300
- 1 <= coins[i] <= 5000
- 0 <= amount <= 5000

Approach (1D DP - combinations):
- dp[x] = number of ways to make sum x.
- Initialize dp[0] = 1 (one way to make zero).
- For each coin c, iterate x from c..amount: dp[x] += dp[x - c].
- Iterating coins outermost ensures combinations (not permutations).

Complexity:
- Time: O(amount * coins.length)
- Space: O(amount)
*/

#include <vector>

class Solution {
public:
    int change(int amount, std::vector<int>& coins) {
        std::vector<int> dp(amount + 1, 0);
        dp[0] = 1;
        for (int c : coins) {
            for (int x = c; x <= amount; ++x) {
                dp[x] += dp[x - c];
            }
        }
        return dp[amount];
    }
};