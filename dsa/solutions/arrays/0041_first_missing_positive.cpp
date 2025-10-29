/*
LeetCode 41. First Missing Positive
Link: https://leetcode.com/problems/first-missing-positive/

Question:
Given an unsorted integer array nums, return the smallest missing positive integer.

Constraints:
- 1 <= nums.length <= 10^5
- -2^31 <= nums[i] <= 2^31 - 1
- Follow up: Can you implement an algorithm that runs in O(n) time and uses O(1) extra space?

Approach:
- Cyclic index placement: place value v into index v-1 when 1 <= v <= n.
- After placement, the first index i where nums[i] != i+1 is the answer; else n+1.
*/

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        int n = static_cast<int>(nums.size());
        for (int i = 0; i < n; ++i) {
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int correct = nums[i] - 1;
                std::swap(nums[i], nums[correct]);
            }
        }
        for (int i = 0; i < n; ++i) {
            if (nums[i] != i + 1) return i + 1;
        }
        return n + 1;
    }
};

/*
Complexity:
- Time: O(n) (each element is swapped at most once into correct index)
- Space: O(1) extra
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<int> a; a.push_back(1); a.push_back(2); a.push_back(0);
    cout << sol.firstMissingPositive(a) << "\n"; // Expected: 3

    vector<int> b; b.push_back(3); b.push_back(4); b.push_back(-1); b.push_back(1);
    cout << sol.firstMissingPositive(b) << "\n"; // Expected: 2

    vector<int> c; c.push_back(7); c.push_back(8); c.push_back(9); c.push_back(11); c.push_back(12);
    cout << sol.firstMissingPositive(c) << "\n"; // Expected: 1
    return 0;
}
#endif