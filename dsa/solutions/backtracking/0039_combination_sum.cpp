/*
LeetCode 39. Combination Sum
Link: https://leetcode.com/problems/combination-sum/

Question:
Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations
of candidates where the chosen numbers sum to target. You may use the same number from candidates an unlimited number
of times. The combinations may be returned in any order.

Constraints:
- 1 <= candidates.length <= 30
- 2 <= target <= 40
- 1 <= candidates[i] <= 40
- All elements of candidates are distinct.

Approach (Backtracking, allow reuse):
- Sort candidates to enable early stopping when candidate > remaining target.
- Recurse with index i to allow reuse of current candidate (pass i again), and move to i+1 to skip it.
- Push current path to result when target == 0.

Complexity:
- Time: exponential in number of valid combinations; pruned by sorting and early break
- Space: O(target) recursion depth in worst case (excluding output)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> combinationSum(std::vector<int>& candidates, int target) {
        std::sort(candidates.begin(), candidates.end());
        std::vector<std::vector<int>> res;
        std::vector<int> path;
        backtrack(candidates, target, 0, path, res);
        return res;
    }
private:
    void backtrack(const std::vector<int>& candidates, int target, size_t idx,
                   std::vector<int>& path, std::vector<std::vector<int>>& res) {
        if (target == 0) {
            res.push_back(path);
            return;
        }
        for (size_t i = idx; i < candidates.size(); ++i) {
            int x = candidates[i];
            if (x > target) break; // early stop due to sorting
            path.push_back(x);
            backtrack(candidates, target - x, i, path, res); // reuse allowed
            path.pop_back();
        }
    }
};