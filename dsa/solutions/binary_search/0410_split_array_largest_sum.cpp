/*
LeetCode 410. Split Array Largest Sum
Link: https://leetcode.com/problems/split-array-largest-sum/

Question:
Given an integer array nums and an integer k, split nums into k non-empty subarrays such that the largest
sum among these subarrays is minimized. Return the minimized largest sum.

Constraints:
- 1 <= nums.length <= 1e5
- 0 <= nums[i] <= 1e9
- 1 <= k <= nums.length

Approach (Binary Search on Answer):
- Feasible predicate: given capacity cap, greedily partition the array; start a new segment when the current
  sum would exceed cap; require segments <= k.
- The minimized largest sum is monotonic in cap; search cap in [max(nums), sum(nums)].

Complexity:
- Time: O(n log(sum(nums)))
- Space: O(1)
*/

#include <vector>
#include <algorithm>
#include <cstdint>

class Solution {
public:
    int splitArray(std::vector<int>& nums, int k) {
        int n = static_cast<int>(nums.size());
        int lo = 0;
        long long hi = 0;
        for (int i = 0; i < n; ++i) {
            if (nums[i] > lo) lo = nums[i];
            hi += static_cast<long long>(nums[i]);
        }
        long long L = lo, R = hi;
        while (L < R) {
            long long mid = L + ((R - L) >> 1);
            if (feasible(nums, k, mid)) {
                R = mid;
            } else {
                L = mid + 1;
            }
        }
        return static_cast<int>(L);
    }
private:
    bool feasible(const std::vector<int>& nums, int k, long long cap) {
        int parts = 1;
        long long sum = 0;
        int n = static_cast<int>(nums.size());
        for (int i = 0; i < n; ++i) {
            if (nums[i] > cap) return false; // cannot fit any segment
            if (sum + nums[i] > cap) {
                ++parts;
                sum = 0;
            }
            sum += nums[i];
            if (parts > k) return false;
        }
        return true;
    }
};