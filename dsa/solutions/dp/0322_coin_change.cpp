/*
LeetCode 322. Coin Change
Link: https://leetcode.com/problems/coin-change/

Question:
You are given an integer array coins representing coins of different denominations and an integer amount.
Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up
by any combination of the coins, return -1.

Constraints:
- 1 <= coins.length <= 12
- 1 <= coins[i] <= 2^31 - 1
- 0 <= amount <= 10^4

Approach (1D DP - unbounded knapsack):
- dp[x] = fewest coins to make sum x. Initialize dp[0] = 0; others = amount + 1 as sentinel.
- For x from 1..amount: for each coin c: if c <= x then dp[x] = min(dp[x], dp[x - c] + 1).
- Answer is dp[amount] if <= amount else -1.

Complexity:
- Time: O(amount * coins.length)
- Space: O(amount)
*/

#include <vector>
#include <algorithm>
#include <climits>

class Solution {
public:
    int coinChange(std::vector<int>& coins, int amount) {
        if (amount == 0) return 0;
        if (coins.empty()) return -1;
        int n = static_cast<int>(coins.size());
        std::vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int x = 1; x <= amount; ++x) {
            for (int j = 0; j < n; ++j) {
                int c = coins[j];
                if (c <= x) {
                    int cand = dp[x - c] + 1;
                    if (cand < dp[x]) dp[x] = cand;
                }
            }
        }
        if (dp[amount] > amount) return -1;
        return dp[amount];
    }
};