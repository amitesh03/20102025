/*
LeetCode 300. Longest Increasing Subsequence
Link: https://leetcode.com/problems/longest-increasing-subsequence/

Question:
Given an integer array nums, return the length of the longest strictly increasing subsequence.

Constraints:
- 1 <= nums.length <= 2e4
- -1e9 <= nums[i] <= 1e9

Approach (Patience sorting with binary search - tails array):
- Maintain an array tails where tails[len-1] is the minimum tail value for an increasing subsequence of length len.
- For each x in nums: find its position via lower_bound in tails and replace; if x is greater than all, append.
- Answer is tails.size().

Complexity:
- Time: O(n log n)
- Space: O(n)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    int lengthOfLIS(const std::vector<int>& nums) {
        std::vector<int> tails;
        tails.reserve(nums.size());
        for (int x : nums) {
            auto it = std::lower_bound(tails.begin(), tails.end(), x);
            if (it == tails.end()) tails.push_back(x);
            else *it = x;
        }
        return static_cast<int>(tails.size());
    }
};