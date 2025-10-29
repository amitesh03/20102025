/*
LeetCode 238. Product of Array Except Self
Link: https://leetcode.com/problems/product-of-array-except-self/

Question:
Given an integer array nums, return an array answer such that answer[i]
is equal to the product of all the elements of nums except nums[i].
The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.
You must write an algorithm that runs in O(n) time and without using the division operation.

Constraints:
- 2 <= nums.length <= 10^5
- -30 <= nums[i] <= 30
- The product of any prefix or suffix of nums fits in a 32-bit integer
*/

#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(const vector<int>& nums) {
        int n = static_cast<int>(nums.size());
        vector<int> ans(n, 1);

        int prefix = 1;
        for (int i = 0; i < n; ++i) {
            ans[i] = prefix;
            prefix *= nums[i];
        }

        int suffix = 1;
        for (int i = n - 1; i >= 0; --i) {
            ans[i] *= suffix;
            suffix *= nums[i];
        }
        return ans;
    }
};

/*
Complexity:
- Time: O(n)
- Space: O(1) extra (output not counted)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<int> nums;
    nums.push_back(1);
    nums.push_back(2);
    nums.push_back(3);
    nums.push_back(4);
    vector<int> ans = sol.productExceptSelf(nums);
    for (int i = 0; i < (int)ans.size(); ++i) {
        if (i) cout << " ";
        cout << ans[i];
    }
    cout << "\n"; // Expected: 24 12 8 6
    return 0;
}
#endif