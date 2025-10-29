/*
LeetCode 442. Find All Duplicates in an Array
Link: https://leetcode.com/problems/find-all-duplicates-in-an-array/

Question:
Given an integer array nums of length n where nums[i] is in the range [1, n],
return an array of all the integers that appear twice in nums. You must return the duplicates
in any order.

Constraints:
- n == nums.length
- 1 <= n <= 1e5
- 1 <= nums[i] <= n

Approach (In-place marking via sign flip):
- Since values are within [1..n], map number x to index idx = |x| - 1.
- Iterate over nums:
  - If nums[idx] is already negative, x has been seen before -> record x as a duplicate.
  - Otherwise, flip nums[idx] to negative to mark x as seen.
- This is O(n) time and O(1) extra space (ignoring output), and keeps results in STL containers.

Complexity:
- Time: O(n)
- Space: O(1) extra (excluding output)
*/

#include <vector>
#include <cmath>

class Solution {
public:
    std::vector<int> findDuplicates(std::vector<int>& nums) {
        std::vector<int> res;
        for (int v : nums) {
            int idx = std::abs(v) - 1;
            if (nums[idx] < 0) {
                res.push_back(std::abs(v));
            } else {
                nums[idx] = -nums[idx];
            }
        }
        return res;
    }
};