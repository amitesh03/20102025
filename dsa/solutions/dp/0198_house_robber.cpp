/*
LeetCode 198. House Robber
Link: https://leetcode.com/problems/house-robber/

Question:
You are a professional robber planning to rob houses along a street. Each house has a certain amount of money.
All houses in this street are arranged in a line. If two adjacent houses are robbed on the same night, the police will be alerted.
Given an integer array nums representing the amount of money of each house, return the maximum amount of money that can be robbed tonight without alerting the police.

Constraints:
- 1 <= nums.length <= 1e4
- 0 <= nums[i] <= 400

Approach (DP with O(1) space):
- Let prev1 be the best up to the previous house (i-1), and prev2 be the best up to (i-2).
- For each value x in nums:
  - take = prev2 + x (rob current; skip previous),
  - skip = prev1 (skip current; keep best so far),
  - cur = max(take, skip).
- Shift window: prev2 = prev1, prev1 = cur.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    int rob(std::vector<int>& nums) {
        int prev2 = 0; // dp[i-2]
        int prev1 = 0; // dp[i-1]
        for (int x : nums) {
            int take = prev2 + x;
            int skip = prev1;
            int cur = (take > skip) ? take : skip;
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
};