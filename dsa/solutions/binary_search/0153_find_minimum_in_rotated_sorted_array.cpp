/*
LeetCode 153. Find Minimum in Rotated Sorted Array
Link: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/

Question:
Given the sorted array nums rotated between 1 and n times, return the minimum element of this array.
You must write an algorithm that runs in O(log n) time.

Constraints:
- 1 <= nums.length <= 1e5
- -1e9 <= nums[i] <= 1e9
- nums contains distinct elements

Approach (Binary Search on rotation pivot):
- Maintain [lo..hi]. Compare nums[mid] with nums[hi].
- If nums[mid] > nums[hi], minimum is in right half, set lo = mid + 1.
- Else, minimum is at mid or in left half, set hi = mid.
- Loop until lo == hi, which points at minimum.

Complexity:
- Time: O(log n)
- Space: O(1)
*/

#include <vector>

class Solution {
public:
    int findMin(std::vector<int>& nums) {
        int lo = 0;
        int hi = static_cast<int>(nums.size()) - 1;
        while (lo < hi) {
            int mid = lo + ((hi - lo) >> 1);
            if (nums[mid] > nums[hi]) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return nums[lo];
    }
};