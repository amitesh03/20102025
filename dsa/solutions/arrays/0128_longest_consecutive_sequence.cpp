/*
LeetCode 128. Longest Consecutive Sequence
Link: https://leetcode.com/problems/longest-consecutive-sequence/

Question:
Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.
You must write an algorithm that runs in O(n) time.

Constraints:
- 0 <= nums.length <= 10^5
- -10^9 <= nums[i] <= 10^9
*/

#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> s(nums.begin(), nums.end());
        int best = 0;
        for (const int x : s) {
            if (s.find(x - 1) == s.end()) {
                int curr = x;
                int len = 1;
                while (s.find(curr + 1) != s.end()) {
                    ++curr;
                    ++len;
                }
                if (len > best) best = len;
            }
        }
        return best;
    }
};

/*
Approach:
- Insert all numbers in an unordered_set for O(1) expected lookups.
- A number starts a sequence if (x - 1) is not present. Expand forward counting length.

Complexity:
- Time: O(n) expected
- Space: O(n)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<int> a = {100, 4, 200, 1, 3, 2};
    cout << sol.longestConsecutive(a) << "\n"; // Expected: 4
    vector<int> b = {0,3,7,2,5,8,4,6,0,1};
    cout << sol.longestConsecutive(b) << "\n"; // Expected: 9
    return 0;
}
#endif