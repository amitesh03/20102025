/*
LeetCode 416. Partition Equal Subset Sum
Link: https://leetcode.com/problems/partition-equal-subset-sum/

Question:
Given a non-empty array nums containing positive integers, determine if it can be partitioned into two subsets such that the sums are equal.

Constraints:
- 1 <= nums.length <= 200
- 1 <= nums[i] <= 100

Approach (Bitset DP):
- Sum S = sum(nums). If S is odd, impossible.
- Target = S/2. Use bitset to track achievable subset sums; initialize dp[0] = true.
- For each x in nums, shift dp by x and OR into dp to add x to all previous sums.
- Check dp[target].

Complexity:
- Time: O(n * target) via bitset shifts
- Space: O(target)
*/

#include <vector>
#include <numeric>
#include <bitset>

class Solution {
public:
    bool canPartition(std::vector<int>& nums) {
        int S = std::accumulate(nums.begin(), nums.end(), 0);
        if ((S & 1) != 0) return false;
        int target = S / 2;
        // Max possible sum given constraints: 200 * 100 = 20000
        std::bitset<20001> dp;
        dp[0] = 1;
        for (int x : nums) {
            dp |= (dp << x);
        }
        return dp[target];
    }
};