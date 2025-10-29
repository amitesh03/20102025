/*
LeetCode 53. Maximum Subarray
Link: https://leetcode.com/problems/maximum-subarray/

Question:
Given an integer array nums, find the subarray with the largest sum, and return its sum.

Constraints:
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4
*/

#include <iostream>
#include <vector>
#include <limits>
using namespace std;

class Solution {
public:
    int maxSubArray(const vector<int>& nums) {
        int best = numeric_limits<int>::min();
        int cur = 0;
        for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
            if (cur < 0) cur = nums[i];
            else cur += nums[i];
            if (cur > best) best = cur;
        }
        return best;
    }
};

/*
Complexity:
- Time: O(n)
- Space: O(1)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<int> nums;
    nums.push_back(-2);
    nums.push_back(1);
    nums.push_back(-3);
    nums.push_back(4);
    nums.push_back(-1);
    nums.push_back(2);
    nums.push_back(1);
    nums.push_back(-5);
    nums.push_back(4);
    cout << sol.maxSubArray(nums) << "\n"; // Expected: 6
    return 0;
}
#endif