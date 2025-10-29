/*
LeetCode 189. Rotate Array
Link: https://leetcode.com/problems/rotate-array/

Question:
Given an array, rotate the array to the right by k steps, where k is non-negative.
Rotation means that each element is shifted to the right by k positions, and the elements wrapping around
to the beginning maintain the relative order induced by rotation.

Constraints:
- 1 <= nums.length <= 10^5
- -2^31 <= nums[i] <= 2^31 - 1
- 0 <= k <= 10^9
*/

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    // Reverse approach: reverse all, reverse first k, reverse the remaining n-k.
    void rotate(vector<int>& nums, int k) {
        int n = static_cast<int>(nums.size());
        if (n <= 1) return;
        k %= n;
        if (k == 0) return;
        reverse(nums.begin(), nums.end());
        reverse(nums.begin(), nums.begin() + k);
        reverse(nums.begin() + k, nums.end());
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
    vector<int> a = {1,2,3,4,5,6,7};
    sol.rotate(a, 3);
    for (int i = 0; i < static_cast<int>(a.size()); ++i) {
        if (i) cout << " ";
        cout << a[i];
    }
    cout << "\n"; // Expected: 5 6 7 1 2 3 4
    return 0;
}
#endif