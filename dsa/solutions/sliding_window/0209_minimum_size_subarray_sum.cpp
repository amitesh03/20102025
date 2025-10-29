/*
LeetCode 209. Minimum Size Subarray Sum
Link: https://leetcode.com/problems/minimum-size-subarray-sum/

Question:
Given an array of positive integers nums and a positive integer target, return the minimal length
of a subarray whose sum is greater than or equal to target. If there is no such subarray, return 0.

Constraints:
- 1 <= nums.length <= 10^5
- 1 <= nums[i] <= 10^4
- 1 <= target <= 10^9

Approach (Sliding Window):
- Maintain a window [l..r] with running sum.
- Expand r to increase sum until sum >= target, then shrink l to minimize window length while maintaining sum >= target.
- Track the minimal window length observed.

Complexity:
- Time: O(n)
- Space: O(1) extra
*/

#include <vector>
#include <algorithm>
#include <climits>

class Solution {
public:
    int minSubArrayLen(int target, std::vector<int>& nums) {
        int n = (int)nums.size();
        int res = INT_MAX;
        long long sum = 0;
        int l = 0;

        for (int r = 0; r < n; ++r) {
            sum += nums[r];
            while (sum >= target) {
                res = std::min(res, r - l + 1);
                sum -= nums[l++];
            }
        }

        return res == INT_MAX ? 0 : res;
    }
};