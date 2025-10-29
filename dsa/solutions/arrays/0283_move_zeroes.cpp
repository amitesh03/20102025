/*
LeetCode 283. Move Zeroes
Link: https://leetcode.com/problems/move-zeroes/

Question:
Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.
Note that you must do this in-place without making a copy of the array.

Constraints:
- 1 <= nums.length <= 10^4
- -2^31 <= nums[i] <= 2^31 - 1
*/

#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    // In-place stable compaction: write non-zero values at 'write' index, then fill remaining with zeros.
    void moveZeroes(vector<int>& nums) {
        int n = static_cast<int>(nums.size());
        int write = 0;
        for (int i = 0; i < n; ++i) {
            if (nums[i] != 0) {
                nums[write] = nums[i];
                ++write;
            }
        }
        while (write < n) {
            nums[write++] = 0;
        }
    }
};

/*
Complexity:
- Time: O(n)
- Space: O(1) extra
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<int> a; a.push_back(0); a.push_back(1); a.push_back(0); a.push_back(3); a.push_back(12);
    sol.moveZeroes(a);
    for (int i = 0; i < static_cast<int>(a.size()); ++i) {
        if (i) cout << " ";
        cout << a[i];
    }
    cout << "\n"; // Expected: 1 3 12 0 0
    return 0;
}
#endif