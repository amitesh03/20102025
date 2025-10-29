/*
LeetCode 77. Combinations
Link: https://leetcode.com/problems/combinations/

Question:
Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n].
You may return the answer in any order.

Constraints:
- 1 <= n <= 20
- 1 <= k <= n

Approach (Backtracking with pruning):
- Build combinations in increasing order by picking next numbers starting from 'start'.
- Prune when remaining numbers (n - i + 1) are insufficient to reach size k.
- Push current path to result when its size reaches k.

Complexity:
- Time: O(C(n, k) * k) to build all combinations
- Space: O(k) recursion and path (excluding output)
*/

#include <vector>

class Solution {
public:
    std::vector<std::vector<int>> combine(int n, int k) {
        std::vector<std::vector<int>> res;
        std::vector<int> path;
        path.reserve(k);
        dfs(1, n, k, path, res);
        return res;
    }
private:
    void dfs(int start, int n, int k, std::vector<int>& path, std::vector<std::vector<int>>& res) {
        if (static_cast<int>(path.size()) == k) {
            res.push_back(path);
            return;
        }
        // Pruning: ensure enough numbers remain to fill to k
        // i can go at most to n - (k - path.size()) + 1
        int need = k - static_cast<int>(path.size());
        for (int i = start; i <= n - need + 1; ++i) {
            path.push_back(i);
            dfs(i + 1, n, k, path, res);
            path.pop_back();
        }
    }
};