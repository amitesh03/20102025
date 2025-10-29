/*
LeetCode 137. Single Number II
Link: https://leetcode.com/problems/single-number-ii/

Question:
Given an integer array nums where every element appears exactly three times except for one element which appears exactly once.
Find the single element and return it.

Constraints:
- 1 <= nums.length <= 3 * 10^4
- -2^31 <= nums[i] <= 2^31 - 1
- Each element in nums appears exactly three times except for one which appears exactly once.

Approach (Bit counting mod 3):
- For each bit position 0..31, count how many numbers have that bit set.
- The bit count modulo 3 gives whether the unique number has that bit set.
- Reconstruct the answer by setting bits with count % 3 == 1.

Complexity:
- Time: O(32 * n) ~ O(n)
- Space: O(1)
*/

#include <vector>
#include <cstdint>

class Solution {
public:
    int singleNumber(std::vector<int>& nums) {
        int res = 0;
        for (int b = 0; b < 32; ++b) {
            int cnt = 0;
            for (int x : nums) {
                cnt += (x >> b) & 1;
            }
            if (cnt % 3 != 0) {
                res |= (1 << b);
            }
        }
        return res;
    }
};