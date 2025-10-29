/*
LeetCode 268. Missing Number
Link: https://leetcode.com/problems/missing-number/

Question:
Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.

Constraints:
- n == nums.length
- 1 <= n <= 10^4
- 0 <= nums[i] <= n
- All the numbers are unique
*/

#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int missingNumber(const vector<int>& nums) {
        int n = static_cast<int>(nums.size());
        int xo = 0;
        for (int i = 0; i < n; ++i) {
            xo ^= i;
            xo ^= nums[i];
        }
        xo ^= n;
        return xo;
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
    vector<int> a; a.push_back(3); a.push_back(0); a.push_back(1);
    cout << sol.missingNumber(a) << "\n"; // Expected: 2
    vector<int> b; b.push_back(0); b.push_back(1);
    cout << sol.missingNumber(b) << "\n"; // Expected: 2
    vector<int> c; c.push_back(9); c.push_back(6); c.push_back(4); c.push_back(2); c.push_back(3); c.push_back(5); c.push_back(7); c.push_back(0); c.push_back(1);
    cout << sol.missingNumber(c) << "\n"; // Expected: 8
    return 0;
}
#endif