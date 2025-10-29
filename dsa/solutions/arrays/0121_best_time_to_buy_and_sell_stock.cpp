/*
LeetCode 121. Best Time to Buy and Sell Stock
Link: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/

Question:
Given an array prices where prices[i] is the price of a stock on day i, maximize profit by choosing a single day to buy and a different day in the future to sell. Return the maximum profit. If no profit is possible, return 0.

Constraints:
- 1 <= prices.length <= 10^5
- 0 <= prices[i] <= 10^4
*/

#include <iostream>
#include <vector>
#include <algorithm>
#include <limits>
using namespace std;

class Solution {
public:
    int maxProfit(const vector<int>& prices) {
        int minPrice = std::numeric_limits<int>::max();
        int best = 0;
        for (size_t i = 0; i < prices.size(); ++i) {
            if (prices[i] < minPrice) minPrice = prices[i];
            int profit = prices[i] - minPrice;
            if (profit > best) best = profit;
        }
        return best;
    }
};

/*
Complexity:
- Time: O(n)
- Space: O(1)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<int> prices{7,1,5,3,6,4};
    cout << sol.maxProfit(prices) << "\n"; // 5
    vector<int> prices2{7,6,4,3,1};
    cout << sol.maxProfit(prices2) << "\n"; // 0
    return 0;
}
#endif