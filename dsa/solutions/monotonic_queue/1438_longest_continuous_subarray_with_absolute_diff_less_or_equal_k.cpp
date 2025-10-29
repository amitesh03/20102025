/*
LeetCode 1438. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit
Link: https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/

Question:
Given an array of integers nums and an integer limit, return the size of the longest
non-empty subarray such that the absolute difference between any two elements of this subarray
is less than or equal to limit.

Constraints:
- 1 <= nums.length <= 10^5
- -10^9 <= nums[i] <= 10^9
- 0 <= limit <= 10^9

Approach (Monotonic Deques for window extremes):
- Maintain a sliding window [l..r] and two deques of indices:
  * maxdq: decreasing values (front holds index of current window maximum)
  * mindq: increasing values (front holds index of current window minimum)
- On adding nums[r], pop from back to maintain monotonicity, then push r.
- While (max - min) > limit, move l forward and pop fronts when their index leaves the window.
- Track the maximum window length.

Complexity:
- Time: O(n) — each index is pushed and popped at most once
- Space: O(n) — deques store indices
*/

#include <vector>
#include <deque>
#include <algorithm>

class Solution {
public:
    int longestSubarray(std::vector<int>& nums, int limit) {
        std::deque<int> maxdq, mindq; // store indices
        int l = 0;
        int best = 0;

        for (int r = 0; r < (int)nums.size(); ++r) {
            while (!maxdq.empty() && nums[maxdq.back()] < nums[r]) maxdq.pop_back();
            maxdq.push_back(r);

            while (!mindq.empty() && nums[mindq.back()] > nums[r]) mindq.pop_back();
            mindq.push_back(r);

            while (!maxdq.empty() && !mindq.empty() && (long long)nums[maxdq.front()] - (long long)nums[mindq.front()] > (long long)limit) {
                if (maxdq.front() == l) maxdq.pop_front();
                if (mindq.front() == l) mindq.pop_front();
                ++l;
            }
            best = std::max(best, r - l + 1);
        }
        return best;
    }
};