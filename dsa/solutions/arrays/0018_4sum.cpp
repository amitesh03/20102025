/*
LeetCode 18. 4Sum
Link: https://leetcode.com/problems/4sum/

Question:
Given an integer array nums and an integer target, return all unique quadruplets [nums[a], nums[b], nums[c], nums[d]]
such that:
- 0 <= a, b, c, d < nums.length,
- a, b, c, and d are all distinct,
- nums[a] + nums[b] + nums[c] + nums[d] == target.

The solution set must not contain duplicate quadruplets.

Constraints:
- 1 <= nums.length <= 200
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
*/

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> fourSum(vector<int>& nums, int target) {
        vector<vector<int>> res;
        sort(nums.begin(), nums.end());
        int n = static_cast<int>(nums.size());
        for (int i = 0; i < n; ++i) {
            if (i > 0 && nums[i] == nums[i - 1]) continue; // skip duplicate i
            for (int j = i + 1; j < n; ++j) {
                if (j > i + 1 && nums[j] == nums[j - 1]) continue; // skip duplicate j
                long long t = static_cast<long long>(target) - static_cast<long long>(nums[i]) - static_cast<long long>(nums[j]);
                int l = j + 1, r = n - 1;
                while (l < r) {
                    long long sum = static_cast<long long>(nums[l]) + static_cast<long long>(nums[r]);
                    if (sum == t) {
                        res.push_back({nums[i], nums[j], nums[l], nums[r]});
                        int lv = nums[l], rv = nums[r];
                        while (l < r && nums[l] == lv) ++l;
                        while (l < r && nums[r] == rv) --r;
                    } else if (sum < t) {
                        ++l;
                    } else {
                        --r;
                    }
                }
            }
        }
        return res;
    }
};

/*
Approach:
- Sort the array, fix two indices (i, j), and use two pointers (l, r) to find pairs summing to target - nums[i] - nums[j].
- Skip duplicates at all levels (i, j, l, r) to ensure uniqueness.
- Use 64-bit arithmetic to avoid overflow when summing values around 1e9.

Complexity:
- Time: O(n^3)
- Space: O(1) extra (excluding output)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<int> a = {1, 0, -1, 0, -2, 2};
    auto ans = sol.fourSum(a, 0);
    for (const auto& q : ans) {
        cout << "[" << q[0] << "," << q[1] << "," << q[2] << "," << q[3] << "]\n";
    }
    return 0;
}
#endif