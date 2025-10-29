/*
LeetCode 122. Best Time to Buy and Sell Stock II
Link: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/

Question:
You are given an integer array prices where prices[i] is the price of a stock on day i.
On each day, you may decide to buy and/or sell; you can hold at most one share at a time.
However, you may buy it then immediately sell it on the same day. Find the maximum profit.

Constraints:
- 1 <= prices.length <= 3e4
- 0 <= prices[i] <= 1e4

Approach (Greedy):
- Sum all positive differences prices[i] - prices[i-1].
- This captures profit from every rising segment; equivalent to optimal multiple transactions.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#include <vector>

class Solution {
public:
    int maxProfit(std::vector<int>& prices) {
        int profit = 0;
        const int n = static_cast<int>(prices.size());
        for (int i = 1; i < n; ++i) {
            if (prices[i] > prices[i - 1]) {
                profit += prices[i] - prices[i - 1];
            }
        }
        return profit;
    }
};