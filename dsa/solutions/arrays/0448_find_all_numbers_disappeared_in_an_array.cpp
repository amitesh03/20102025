/*
LeetCode 448. Find All Numbers Disappeared in an Array
Link: https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/

Question:
Given an array nums of n integers where nums[i] is in the range [1, n], return an array of all the integers
in the range [1, n] that do not appear in nums.

Constraints:
- n == nums.length
- 1 <= n <= 1e5
- 1 <= nums[i] <= n

Approach (In-place marking via sign flip):
- For each value x in nums, map it to index idx = |x| - 1 and flip nums[idx] to negative to mark presence.
- After marking, indices i with nums[i] > 0 correspond to missing numbers (i + 1).
- This uses O(1) extra space (ignoring output) and linear time.

Complexity:
- Time: O(n)
- Space: O(1) extra (excluding output)
*/

#include <vector>

class Solution {
    static inline int absInt(int x) { return x < 0 ? -x : x; }
public:
    std::vector<int> findDisappearedNumbers(std::vector<int>& nums) {
        const int n = static_cast<int>(nums.size());
        for (int i = 0; i < n; ++i) {
            int v = absInt(nums[i]);
            int idx = v - 1;
            if (nums[idx] > 0) {
                nums[idx] = -nums[idx];
            }
        }
        std::vector<int> res;
        res.reserve(n);
        for (int i = 0; i < n; ++i) {
            if (nums[i] > 0) res.push_back(i + 1);
        }
        return res;
    }
};