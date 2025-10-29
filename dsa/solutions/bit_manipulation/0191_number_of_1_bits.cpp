/*
LeetCode 191. Number of 1 Bits
Link: https://leetcode.com/problems/number-of-1-bits/

Question:
Write a function that takes the binary representation of an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).

Constraints:
- The input must be a binary string of length 32 (unsigned 32-bit integer)

Approach (Brian Kernighan’s bit hack):
- Repeatedly clear the lowest-set bit using n = n & (n - 1), counting the operations.
- Each iteration removes one set bit, so the loop runs popcount times.

Complexity:
- Time: O(k), where k is the number of set bits (<= 32)
- Space: O(1)
*/

#include <cstdint>

class Solution {
public:
    int hammingWeight(uint32_t n) {
        int count = 0;
        while (n) {
            n &= (n - 1);
            ++count;
        }
        return count;
    }
};