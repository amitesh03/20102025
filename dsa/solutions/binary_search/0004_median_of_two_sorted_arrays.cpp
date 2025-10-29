/*
LeetCode 4. Median of Two Sorted Arrays
Link: https://leetcode.com/problems/median-of-two-sorted-arrays/

Question:
Given two sorted arrays nums1 and nums2 of sizes m and n respectively, return the median of the two sorted arrays.
The overall run time complexity should be O(log(min(m, n))).

Constraints:
- 0 <= m, n <= 1e5
- -1e9 <= nums1[i], nums2[i] <= 1e9
- m + n > 0

Approach (Binary Search on partition):
- Ensure m <= n; binary search partition i in nums1 and j in nums2 such that left parts have (m+n+1)/2 elements.
- Border values: left1 = nums1[i-1] (or -inf), right1 = nums1[i] (or +inf), similarly for left2/right2.
- If left1 <= right2 and left2 <= right1, we found the correct partition.
- Median is either max(left1,left2) (odd length) or average of max(left1,left2) and min(right1,right2) (even length).

Complexity:
- Time: O(log(min(m, n)))
- Space: O(1)
*/

#include <vector>
#include <algorithm>
#include <climits>

class Solution {
public:
    double findMedianSortedArrays(const std::vector<int>& nums1, const std::vector<int>& nums2) {
        int m = static_cast<int>(nums1.size());
        int n = static_cast<int>(nums2.size());
        if (m > n) {
            return findMedianSortedArrays(nums2, nums1);
        }
        int lo = 0, hi = m;
        while (lo <= hi) {
            int i = lo + ((hi - lo) >> 1);
            int j = ((m + n + 1) >> 1) - i;

            int left1 = (i == 0) ? INT_MIN : nums1[i - 1];
            int right1 = (i == m) ? INT_MAX : nums1[i];
            int left2 = (j == 0) ? INT_MIN : nums2[j - 1];
            int right2 = (j == n) ? INT_MAX : nums2[j];

            if (left1 <= right2 && left2 <= right1) {
                if (((m + n) & 1) == 0) {
                    int leftMax = (left1 > left2) ? left1 : left2;
                    int rightMin = (right1 < right2) ? right1 : right2;
                    return (leftMax + rightMin) / 2.0;
                } else {
                    int leftMax = (left1 > left2) ? left1 : left2;
                    return static_cast<double>(leftMax);
                }
            } else if (left1 > right2) {
                hi = i - 1;
            } else {
                lo = i + 1;
            }
        }
        return 0.0; // should not reach for valid inputs
    }
};