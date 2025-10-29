/*
LeetCode 40. Combination Sum II
Link: https://leetcode.com/problems/combination-sum-ii/

Question:
Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations
in candidates where the candidate numbers sum to target. Each number in candidates may only be used once in the combination.
The solution set must not contain duplicate combinations.

Constraints:
- 1 <= candidates.length <= 100
- 1 <= candidates[i] <= 50
- 1 <= target <= 30

Approach (Backtracking with sorting + skip duplicates):
- Sort candidates to group duplicates and enable early stopping when candidate > remaining.
- Iterate index i from 'start'; skip duplicates via (i > start && candidates[i] == candidates[i - 1]).
- Choose candidates[i], recurse with start = i + 1 (use each element at most once), and backtrack.

Complexity:
- Time: exponential in number of valid combinations, pruned by sorting and early break
- Space: O(n) recursion depth (excluding output)
*/

#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> combinationSum2(std::vector<int>& candidates, int target) {
        std::sort(candidates.begin(), candidates.end());
        std::vector<std::vector<int>> res;
        std::vector<int> path;
        backtrack(candidates, target, 0, path, res);
        return res;
    }
private:
    void backtrack(const std::vector<int>& candidates,
                   int remaining,
                   size_t start,
                   std::vector<int>& path,
                   std::vector<std::vector<int>>& res) {
        if (remaining == 0) {
            res.push_back(path);
            return;
        }
        for (size_t i = start; i < candidates.size(); ++i) {
            int x = candidates[i];
            if (i > start && candidates[i] == candidates[i - 1]) continue; // skip duplicates
            if (x > remaining) break; // early stopping
            path.push_back(x);
            backtrack(candidates, remaining - x, i + 1, path, res);
            path.pop_back();
        }
    }
};