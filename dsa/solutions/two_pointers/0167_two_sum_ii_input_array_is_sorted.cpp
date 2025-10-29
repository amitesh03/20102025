/*
LeetCode 167. Two Sum II - Input Array Is Sorted
Link: https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/

Question:
Given a 1-indexed array numbers that is sorted in non-decreasing order, find two numbers such that they add up to a specific target number and return the indices of the two numbers (1-indexed).

Constraints:
- 2 <= numbers.length <= 3 * 10^4
- -1000 <= numbers[i] <= 1000
- numbers is non-decreasing; exactly one solution exists

Approach (Two Pointers):
- Maintain two pointers at the ends (l=0, r=n-1).
- If numbers[l] + numbers[r] < target, increment l to increase sum; else decrement r to decrease sum.
- When equal, return 1-based indices {l+1, r+1}.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#include <vector>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& numbers, int target) {
        int l = 0, r = (int)numbers.size() - 1;
        while (l < r) {
            long long sum = (long long)numbers[l] + (long long)numbers[r];
            if (sum == target) {
                return {l + 1, r + 1};
            } else if (sum < target) {
                ++l;
            } else {
                --r;
            }
        }
        return {};
    }
};