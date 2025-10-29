/*
LeetCode 70. Climbing Stairs
Link: https://leetcode.com/problems/climbing-stairs/

Question:
You are climbing a staircase. It takes n steps to reach the top.
Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?

Constraints:
- 1 <= n <= 45

Approach (DP with O(1) space - Fibonacci):
- ways[n] = ways[n-1] + ways[n-2] with base ways[1]=1, ways[2]=2.
- Iterate from 3..n tracking only two previous values.

Complexity:
- Time: O(n)
- Space: O(1)
*/

class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; ++i) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
};