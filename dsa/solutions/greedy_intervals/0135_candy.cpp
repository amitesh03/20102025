/*
LeetCode 135. Candy
Link: https://leetcode.com/problems/candy/

Question:
There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings.
You are giving candies to these children subjected to the following requirements:
- Each child must have at least one candy.
- Children with a higher rating get more candies than their neighbors.
Return the minimum number of candies you need to have to distribute the candies to the children.

Constraints:
- n == ratings.length
- 1 <= n <= 2 * 10^5
- 0 <= ratings[i] <= 2 * 10^5

Approach (Two passes Greedy):
- Give everyone 1 candy initially.
- Left to right: if ratings[i] > ratings[i-1], candies[i] = candies[i-1] + 1.
- Right to left: if ratings[i] > ratings[i+1], candies[i] = max(candies[i], candies[i+1] + 1).
- Sum candies.

Complexity:
- Time: O(n)
- Space: O(n)
*/

#include <vector>
#include <algorithm>
#include <cstdint>

class Solution {
public:
    int candy(std::vector<int>& ratings) {
        int n = static_cast<int>(ratings.size());
        if (n <= 1) return n;
        std::vector<int> candies(n, 1);
        for (int i = 1; i < n; ++i) {
            if (ratings[i] > ratings[i - 1]) {
                candies[i] = candies[i - 1] + 1;
            }
        }
        for (int i = n - 2; i >= 0; --i) {
            if (ratings[i] > ratings[i + 1]) {
                candies[i] = std::max(candies[i], candies[i + 1] + 1);
            }
        }
        long long sum = 0;
        for (int c : candies) sum += c;
        return static_cast<int>(sum);
    }
};