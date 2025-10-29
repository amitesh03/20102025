/*
LeetCode 560. Subarray Sum Equals K
Link: https://leetcode.com/problems/subarray-sum-equals-k/

Question:
Given an array of integers nums and an integer k, return the total number of continuous subarrays
whose sum equals to k.

Constraints:
- 1 <= nums.length <= 2 * 10^4
- -1000 <= nums[i] <= 1000
- -10^7 <= k <= 10^7
*/

#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int subarraySum(const vector<int>& nums, int k) {
        unordered_map<long long, int> freq;
        freq[0] = 1; // empty prefix sum

        long long sum = 0;
        int count = 0;

        for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
            sum += nums[i];
            long long need = sum - k;
            unordered_map<long long, int>::iterator it = freq.find(need);
            if (it != freq.end()) {
                count += it->second;
            }
            ++freq[sum];
        }
        return count;
    }
};

/*
Complexity:
- Time: O(n)
- Space: O(n)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<int> nums;
    nums.push_back(1);
    nums.push_back(1);
    nums.push_back(1);
    int k = 2;
    int ans = sol.subarraySum(nums, k);
    cout << ans << "\n"; // Expected: 2

    vector<int> a;
    a.push_back(3);
    a.push_back(4);
    a.push_back(7);
    a.push_back(2);
    a.push_back(-3);
    a.push_back(1);
    a.push_back(4);
    int k2 = 7;
    cout << sol.subarraySum(a, k2) << "\n"; // Expected: 4
    return 0;
}
#endif