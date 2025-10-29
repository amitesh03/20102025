/*
LeetCode 540. Single Element in a Sorted Array
Link: https://leetcode.com/problems/single-element-in-a-sorted-array/

Question:
You are given a sorted array where every element appears exactly twice except for one element that appears only once.
Return the single element that appears only once.
Your solution must run in O(log n) time and O(1) space.

Constraints:
- 1 <= nums.length <= 1e5
- -1e9 <= nums[i] <= 1e9
- nums is sorted in non-decreasing order

Approach (Binary Search on index parity):
- Before the single element, pairs occupy (even, odd) indices; after it, pairs shift to (odd, even).
- Binary search the boundary:
  - Force mid to be even. If nums[mid] == nums[mid+1], the single is to the right; move lo to mid+2.
  - Otherwise, the boundary is at or before mid; move hi to mid.
- At convergence, lo is the index of the single element.

Complexity:
- Time: O(log n)
- Space: O(1)
*/

#include <vector>

class Solution {
public:
    int singleNonDuplicate(const std::vector<int>& nums) {
        int lo = 0;
        int hi = static_cast<int>(nums.size()) - 1;
        while (lo < hi) {
            int mid = lo + ((hi - lo) >> 1);
            if (mid % 2 == 1) mid--;
            if (nums[mid] == nums[mid + 1]) {
                lo = mid + 2;
            } else {
                hi = mid;
            }
        }
        return nums[lo];
    }
};