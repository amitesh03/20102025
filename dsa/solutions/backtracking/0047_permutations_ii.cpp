/*
LeetCode 47. Permutations II
Link: https://leetcode.com/problems/permutations-ii/

Question:
Given a collection of numbers, nums, that might contain duplicates, return all possible unique permutations in any order.

Constraints:
- 1 <= nums.length <= 8
- -10 <= nums[i] <= 10

Approach (Backtracking with deduplication):
- Sort the array so duplicates are adjacent.
- Use a 'used' boolean array to track taken indices in the current permutation.
- Skip duplicates: if nums[i] == nums[i-1] and the previous identical element is not used in the current position,
  then using nums[i] would create a duplicate permutation; continue.

Complexity:
- Time: O(n * n!) in the worst case (number of unique permutations)
- Space: O(n) recursion + O(n) state (excluding output)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> permuteUnique(std::vector<int>& nums) {
        std::sort(nums.begin(), nums.end());
        std::vector<std::vector<int>> res;
        std::vector<int> path;
        path.reserve(nums.size());
        std::vector<char> used(nums.size(), 0);
        backtrack(nums, used, path, res);
        return res;
    }
private:
    void backtrack(const std::vector<int>& nums,
                   std::vector<char>& used,
                   std::vector<int>& path,
                   std::vector<std::vector<int>>& res) {
        if (path.size() == nums.size()) {
            res.push_back(path);
            return;
        }
        for (size_t i = 0; i < nums.size(); ++i) {
            if (used[i]) continue;
            if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;
            used[i] = 1;
            path.push_back(nums[i]);
            backtrack(nums, used, path, res);
            path.pop_back();
            used[i] = 0;
        }
    }
};