/*
LeetCode 136. Single Number
Link: https://leetcode.com/problems/single-number/

Question:
Given a non-empty array of integers nums, every element appears exactly twice except for one. Find that single one.
You must implement a solution with a linear runtime complexity and use only constant extra space.

Constraints:
- 1 <= nums.length <= 3 * 10^4
- -3 * 10^4 <= nums[i] <= 3 * 10^4

Approach (Bit Manipulation - XOR):
- XOR has properties: a ^ a = 0, a ^ 0 = a, and commutative/associative.
- XOR all elements; pairs cancel to 0, leaving the unique element.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#include <vector>

class Solution {
public:
    int singleNumber(std::vector<int>& nums) {
        int x = 0;
        for (int v : nums) x ^= v;
        return x;
    }
};

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    std::vector<int> a{2,2,1};
    std::vector<int> b{4,1,2,1,2};
    std::vector<int> c{1};
    std::cout << sol.singleNumber(a) << "\n"; // 1
    std::cout << sol.singleNumber(b) << "\n"; // 4
    std::cout << sol.singleNumber(c) << "\n"; // 1
    return 0;
}
#endif