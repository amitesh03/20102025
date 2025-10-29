/*
LeetCode 523. Continuous Subarray Sum
Link: https://leetcode.com/problems/continuous-subarray-sum/

Question:
Given an integer array nums and an integer k, return true if nums has a continuous subarray
of size at least two whose elements sum up to a multiple of k, or false otherwise.

Constraints:
- 1 <= nums.length <= 10^5
- 0 <= nums[i] <= 10^9
- |k| <= 2 * 10^9

Approach (Prefix sum + modulo):
- For k != 0: If two prefix sums have the same remainder modulo k and are at least
  2 indices apart, their difference (the subarray) sums to a multiple of k.
  Track the first index for each remainder; seed remainder 0 at index -1.
- For k == 0: We need a subarray sum equal to 0; with non-negative nums, this occurs
  iff there exist two consecutive zeros.

Complexity:
- Time: O(n)
- Space: O(min(n, |k|)) for the remainder map
*/

#include <vector>
#include <unordered_map>

class Solution {
public:
    bool checkSubarraySum(std::vector<int>& nums, int k) {
        int n = (int)nums.size();
        if (n < 2) return false;

        if (k == 0) {
            for (int i = 1; i < n; ++i) {
                if (nums[i] == 0 && nums[i - 1] == 0) return true;
            }
            return false;
        }

        std::unordered_map<int, int> first;
        first.reserve(n + 1);
        first[0] = -1;

        long long sum = 0;
        for (int i = 0; i < n; ++i) {
            sum += nums[i];
            int r = (int)(sum % k);
            auto it = first.find(r);
            if (it != first.end()) {
                if (i - it->second >= 2) return true;
            } else {
                first.emplace(r, i);
            }
        }
        return false;
    }
};