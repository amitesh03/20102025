/*
LeetCode 494. Target Sum
Link: https://leetcode.com/problems/target-sum/

Question:
You are given an integer array nums and an integer target.
You want to build an expression out of nums by adding one of the symbols '+' and '-' before each integer in nums.
Return the number of different expressions that evaluate to target.

Constraints:
- 1 <= nums.length <= 200
- 0 <= nums[i] <= 1000
- 0 <= sum(nums[i]) <= 20000
- -1000 <= target <= 1000

Approach (Transform to subset-sum count):
- Let total = sum(nums). Assigning +/- signs means choosing a subset P to be positive and the rest negative:
    sum(P) - (total - sum(P)) = target  =>  2*sum(P) - total = target  =>  sum(P) = (total + target) / 2
- So we need to count the number of subsets whose sum equals S = (total + target)/2.
- If total + target is odd, or S is negative, there are 0 ways.
- Use 1D DP to count subsets with sum S:
    dp[0] = 1
    For each x in nums:
        for s from S down to x:
            dp[s] += dp[s - x]
- Zeros are handled naturally (they double the number of ways when included), since adding zero updates dp[s] += dp[s].

Complexity:
- Time: O(n * S)
- Space: O(S)
*/

#include <vector>
#include <numeric>
#include <cstdint>

class Solution {
public:
    int findTargetSumWays(std::vector<int>& nums, int target) {
        long long total = std::accumulate(nums.begin(), nums.end(), 0LL);
        long long sumNeededTimes2 = total + target;
        if (sumNeededTimes2 < 0 || (sumNeededTimes2 & 1LL)) return 0;
        long long S = sumNeededTimes2 / 2;
        if (S < 0) return 0;

        // Bound S to int since constraints cap total <= 20000
        int S_int = static_cast<int>(S);
        std::vector<long long> dp(S_int + 1, 0);
        dp[0] = 1;

        for (int x : nums) {
            if (x <= S_int) {
                for (int s = S_int; s >= x; --s) {
                    dp[s] += dp[s - x];
                }
            }
            // If x > S_int, skip since it can't contribute to any valid subset sum
        }
        // The answer fits into 32-bit signed integer per typical problem constraints
        return static_cast<int>(dp[S_int]);
    }
};