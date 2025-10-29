/*
LeetCode 46. Permutations
Link: https://leetcode.com/problems/permutations/

Question:
Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.

Constraints:
- 1 <= nums.length <= 6
- -10 <= nums[i] <= 10
- All the integers of nums are unique.

Approach (Backtracking):
- Build permutations by choosing each unused element in turn, marking used, and exploring recursively.
- Use a boolean used[] to track which indices are in the current path.

Complexity:
- Time: O(n * n!) to generate all permutations
- Space: O(n) recursion + O(n) state (excluding output)
*/

#include <vector>

class Solution {
public:
    std::vector<std::vector<int>> permute(std::vector<int>& nums) {
        const int n = static_cast<int>(nums.size());
        std::vector<std::vector<int>> res;
        std::vector<int> cur;
        cur.reserve(n);
        std::vector<char> used(n, 0);
        backtrack(nums, used, cur, res);
        return res;
    }
private:
    void backtrack(const std::vector<int>& nums,
                   std::vector<char>& used,
                   std::vector<int>& cur,
                   std::vector<std::vector<int>>& res) {
        if (cur.size() == nums.size()) {
            res.push_back(cur);
            return;
        }
        for (size_t i = 0; i < nums.size(); ++i) {
            if (used[i]) continue;
            used[i] = 1;
            cur.push_back(nums[i]);
            backtrack(nums, used, cur, res);
            cur.pop_back();
            used[i] = 0;
        }
    }
};