/*
LeetCode 78. Subsets
Link: https://leetcode.com/problems/subsets/

Question:
Given an integer array nums of unique elements, return all possible subsets (the power set).
The solution set must not contain duplicate subsets.

Constraints:
- 1 <= nums.length <= 10
- -10 <= nums[i] <= 10
- All elements are unique.

Approach (Backtracking):
- Generate subsets by progressively deciding to include each element from the current index onward.
- At each recursion level, add the current path to the result before exploring further inclusions.

Complexity:
- Time: O(n * 2^n) to build all subsets
- Space: O(n) recursion and path (excluding output)
*/

#include <vector>

class Solution {
public:
    std::vector<std::vector<int>> subsets(std::vector<int>& nums) {
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
            path.push_back(nums[i]);
            backtrack(nums, i + 1, path, res);
            path.pop_back();
        }
    }
};