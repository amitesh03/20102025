/*
LeetCode 338. Counting Bits
Link: https://leetcode.com/problems/counting-bits/

Question:
Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n),
ans[i] is the number of 1's in the binary representation of i.

Constraints:
- 0 <= n <= 1e5

Approach (DP using bit recurrence):
- Use the recurrence: popcount(i) = popcount(i >> 1) + (i & 1).
- Build ans from 0..n where ans[0] = 0 and for each i >= 1, ans[i] depends on ans[i >> 1].

Complexity:
- Time: O(n)
- Space: O(n)
*/

#include <vector>

class Solution {
public:
    std::vector<int> countBits(int n) {
        std::vector<int> ans(n + 1, 0);
        for (int i = 1; i <= n; ++i) {
            ans[i] = ans[i >> 1] + (i & 1);
        }
        return ans;
    }
};