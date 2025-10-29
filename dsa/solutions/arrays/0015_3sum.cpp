/*
LeetCode 15. 3Sum
Link: https://leetcode.com/problems/3sum/

Question:
Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]]
such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
The solution set must not contain duplicate triplets.

Constraints:
- 3 <= nums.length <= 3000
- -10^5 <= nums[i] <= 10^5
*/

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        vector<vector<int>> res;
        sort(nums.begin(), nums.end());
        int n = static_cast<int>(nums.size());
        for (int i = 0; i < n; ++i) {
            if (i > 0 && nums[i] == nums[i-1]) continue; // skip duplicate fixed
            int target = -nums[i];
            int l = i + 1, r = n - 1;
            while (l < r) {
                int sum = nums[l] + nums[r];
                if (sum == target) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    // advance l and r skipping duplicates
                    int lv = nums[l], rv = nums[r];
                    while (l < r && nums[l] == lv) ++l;
                    while (l < r && nums[r] == rv) --r;
                } else if (sum < target) {
                    ++l;
                } else {
                    --r;
                }
            }
        }
        return res;
    }
};

/*
Approach:
- Sort the array and for each index i, run two-pointer search on subarray [i+1..n-1] for pairs summing to -nums[i].
- Skip duplicates for i, l, and r to ensure unique triplets.

Complexity:
- Time: O(n^2)
- Space: O(1) extra ignoring output
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<int> a = {-1,0,1,2,-1,-4};
    auto ans = sol.threeSum(a);
    for (const auto& t : ans) {
        cout << "[" << t[0] << "," << t[1] << "," << t[2] << "]\n";
    }
    // Expected:
    // [-1,-1,2]
    // [-1,0,1]
    return 0;
}
#endif