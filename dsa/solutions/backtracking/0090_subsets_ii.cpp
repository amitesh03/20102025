/*
LeetCode 90. Subsets II
Link: https://leetcode.com/problems/subsets-ii/

Question:
Given an integer array nums that may contain duplicates, return all possible subsets (the power set).
The solution set must not contain duplicate subsets.

Constraints:
- 1 <= nums.length <= 10
- -10 <= nums[i] <= 10

Approach (Backtracking with deduplication):
- Sort nums so duplicates are adjacent.
- Use backtracking from index 'start' and at each level, skip taking duplicates:
  if nums[i] == nums[i-1] and i > start, continue.
- Push current path to result at every recursion level.

Complexity:
- Time: O(n * 2^n) to generate all subsets
- Space: O(n) recursion depth (excluding output)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> subsetsWithDup(std::vector<int>& nums) {
        std::sort(nums.begin(), nums.end());
        std::vector<std::vector<int>> res;
        std::vector<int> path;
        backtrack(nums, 0, path, res);
        return res;
    }
private:
    void backtrack(const std::vector<int>& nums,
                   size_t start,
                   std::vector<int>& path,
                   std::vector<std::vector<int>>& res) {
        res.push_back(path);
        for (size_t i = start; i < nums.size(); ++i) {
            if (i > start && nums[i] == nums[i - 1]) continue;
            path.push_back(nums[i]);
            backtrack(nums, i + 1, path, res);
            path.pop_back();
        }
    }
};