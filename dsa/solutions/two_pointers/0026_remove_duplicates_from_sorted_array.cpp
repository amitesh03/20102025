/*
LeetCode 26. Remove Duplicates from Sorted Array
Link: https://leetcode.com/problems/remove-duplicates-from-sorted-array/

Question:
Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place
such that each unique element appears only once. The relative order must be kept. Return the new length.

Constraints:
- 1 <= nums.length <= 3 * 10^4
- -10^4 <= nums[i] <= 10^4
- nums is sorted in non-decreasing order

Approach (Two pointers write index):
- Maintain write index w for the place to write the next unique element.
- Iterate i from 1..n-1; when nums[i] != nums[w-1], write nums[w] = nums[i], then ++w.
- Return w. Array modified in-place in the first w positions.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#include <vector>

class Solution {
public:
    int removeDuplicates(std::vector<int>& nums) {
        int n = (int)nums.size();
        if (n == 0) return 0;
        int w = 1;
        for (int i = 1; i < n; ++i) {
            if (nums[i] != nums[w - 1]) {
                nums[w] = nums[i];
                ++w;
            }
        }
        return w;
    }
};