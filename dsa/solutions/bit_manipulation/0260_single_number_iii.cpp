/*
LeetCode 260. Single Number III
Link: https://leetcode.com/problems/single-number-iii/

Question:
Given an integer array nums, in which exactly two elements appear only once and all the other elements appear exactly twice.
Find the two elements that appear only once. You can return the answer in any order.

Constraints:
- 2 <= nums.length <= 3 * 10^4
- -2^31 <= nums[i] <= 2^31 - 1
- Exactly two elements appear once; all others appear twice.

Approach (XOR partition by rightmost set bit):
- XOR all numbers to get x = a ^ b where a and b are the two unique numbers.
- Find a distinguishing bit: lowbit = x & -x (rightmost set bit).
- Partition nums by this bit: numbers with the bit set vs not set; XOR within each partition to recover a and b.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#include <vector>
#include <cstdint>

class Solution {
public:
    std::vector<int> singleNumber(std::vector<int>& nums) {
        int x = 0;
        for (int v : nums) x ^= v;
        int lowbit = x & -x;
        int a = 0, b = 0;
        for (int v : nums) {
            if (v & lowbit) a ^= v;
            else b ^= v;
        }
        return {a, b};
    }
};