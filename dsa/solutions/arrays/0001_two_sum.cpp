/*
LeetCode 1. Two Sum
Link: https://leetcode.com/problems/two-sum/

Question:
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
*/

#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(const vector<int>& nums, int target) {
        unordered_map<int,int> index;
        // Reserve to reduce rehashes (optional optimization)
        index.reserve(nums.size() * 2);

        for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
            int need = target - nums[i];
            unordered_map<int,int>::iterator it = index.find(need);
            if (it != index.end()) {
                vector<int> res(2);
                res[0] = it->second;
                res[1] = i;
                return res;
            }
            index[nums[i]] = i;
        }
        return vector<int>(); // no solution (per constraints this won't happen)
    }
};

/*
Complexity:
- Time: O(n)
- Space: O(n)
*/

// Optional local test harness
#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<int> nums;
    nums.push_back(2);
    nums.push_back(7);
    nums.push_back(11);
    nums.push_back(15);
    int target = 9;
    vector<int> ans = sol.twoSum(nums, target);
    cout << ans[0] << " " << ans[1] << "\n";
    return 0;
}
#endif