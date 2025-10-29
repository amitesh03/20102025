/*
LeetCode 392. Is Subsequence
Link: https://leetcode.com/problems/is-subsequence/

Question:
Given two strings s and t, return true if s is a subsequence of t, or false otherwise.
A subsequence is a sequence that can be derived from another string by deleting some or no elements
without changing the order of the remaining elements.

Constraints:
- 0 <= s.length <= 100
- 0 <= t.length <= 10^4
- s and t consist only of lowercase English letters.
*/

#include <iostream>
#include <string>
using namespace std;


// C++ STL two-pointer solution

class Solution {
public:
    bool isSubsequence(string s, string t) {
        int i = 0;
        for (int j = 0; j < static_cast<int>(t.size()); ++j) {
            if (i < static_cast<int>(s.size()) && s[i] == t[j]) {
                ++i;
            }
        }
        return i == static_cast<int>(s.size());
    }
};

/*
Approach:
- Two pointers: advance pointer on s when matching char is found in t; true if s fully matched by the end.

Complexity:
- Time: O(|t|)
- Space: O(1)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    cout << (sol.isSubsequence("abc", "ahbgdc") ? "true" : "false") << "\n"; // true
    cout << (sol.isSubsequence("axc", "ahbgdc") ? "true" : "false") << "\n"; // false
    cout << (sol.isSubsequence("", "abc") ? "true" : "false") << "\n";       // true
    cout << (sol.isSubsequence("abc", "") ? "true" : "false") << "\n";       // false
    return 0;
}
#endif