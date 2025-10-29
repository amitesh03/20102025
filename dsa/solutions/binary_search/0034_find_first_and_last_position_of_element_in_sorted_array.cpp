/*
LeetCode 34. Find First and Last Position of Element in Sorted Array
Link: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/

Question:
Given a sorted array nums and a target value target, return the starting and ending position of target in nums.
If target is not found, return [-1, -1].

Constraints:
- 0 <= nums.length <= 1e5
- -1e9 <= nums[i], target <= 1e9
- nums is non-decreasing (sorted)

Approach (Binary Search for boundaries):
- Find the leftmost occurrence via lower bound (first index i with nums[i] >= target).
- If nums[left] != target, return [-1, -1].
- Find rightmost occurrence via upper bound (first index j with nums[j] > target) then j-1.

Complexity:
- Time: O(log n)
- Space: O(1)
*/

#include <vector>

class Solution {
public:
    std::vector<int> searchRange(const std::vector<int>& nums, int target) {
        const int n = static_cast<int>(nums.size());
        int left = lowerBound(nums, target);
        if (left == n || nums[left] != target) return {-1, -1};
        int right = upperBound(nums, target) - 1;
        return {left, right};
    }
private:
    int lowerBound(const std::vector<int>& a, int x) {
        int lo = 0, hi = static_cast<int>(a.size());
        while (lo < hi) {
            int mid = lo + ((hi - lo) >> 1);
            if (a[mid] < x) lo = mid + 1; else hi = mid;
        }
        return lo;
    }
    int upperBound(const std::vector<int>& a, int x) {
        int lo = 0, hi = static_cast<int>(a.size());
        while (lo < hi) {
            int mid = lo + ((hi - lo) >> 1);
            if (a[mid] <= x) lo = mid + 1; else hi = mid;
        }
        return lo;
    }
};