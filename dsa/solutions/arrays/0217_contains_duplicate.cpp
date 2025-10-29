/*
LeetCode 217. Contains Duplicate
Link: https://leetcode.com/problems/contains-duplicate/

Question:
Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.

Constraints:
- 1 <= nums.length <= 10^5
- -10^9 <= nums[i] <= 10^9
*/

#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

class Solution {
public:
    bool containsDuplicate(const vector<int>& nums) {
        unordered_set<int> seen;
        seen.reserve(nums.size() * 2);
        for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
            if (seen.find(nums[i]) != seen.end()) return true;
            seen.insert(nums[i]);
        }
        return false;
    }
};

/*
Complexity:
- Time: O(n) expected
- Space: O(n)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<int> a;
    a.push_back(1); a.push_back(2); a.push_back(3); a.push_back(1);
    cout << (sol.containsDuplicate(a) ? "true" : "false") << "\n"; // true

    vector<int> b;
    b.push_back(1); b.push_back(2); b.push_back(3); b.push_back(4);
    cout << (sol.containsDuplicate(b) ? "true" : "false") << "\n"; // false

    vector<int> c;
    c.push_back(1); c.push_back(1); c.push_back(1); c.push_back(3); c.push_back(3); c.push_back(4); c.push_back(3); c.push_back(2); c.push_back(4); c.push_back(2);
    cout << (sol.containsDuplicate(c) ? "true" : "false") << "\n"; // true
    return 0;
}
#endif