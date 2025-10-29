/*
LeetCode 5. Longest Palindromic Substring
Link: https://leetcode.com/problems/longest-palindromic-substring/

Question:
Given a string s, return the longest palindromic substring in s.

Constraints:
- 1 <= s.length <= 1000
- s consist of only digits and English letters.
*/

#include <iostream>
#include <string>
using namespace std;

class Solution {
public:
    string longestPalindrome(string s) {
        int n = static_cast<int>(s.size());
        if (n <= 1) return s;
        int bestL = 0, bestLen = 1;

        auto expand = [&](int l, int r) {
            while (l >= 0 && r < n && s[l] == s[r]) { --l; ++r; }
            int len = r - l - 1;
            int start = l + 1;
            if (len > bestLen) {
                bestLen = len;
                bestL = start;
            }
        };

        for (int i = 0; i < n; ++i) {
            expand(i, i);       // odd-length center
            expand(i, i + 1);   // even-length center
        }
        return s.substr(bestL, bestLen);
    }
};

/*
Approach:
- Expand around each center (single char and between two chars) to find maximum-length palindrome.

Complexity:
- Time: O(n^2)
- Space: O(1)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    cout << sol.longestPalindrome("babad") << "\n"; // "bab" or "aba"
    cout << sol.longestPalindrome("cbbd") << "\n";  // "bb"
    cout << sol.longestPalindrome("a") << "\n";     // "a"
    cout << sol.longestPalindrome("ac") << "\n";    // "a" or "c"
    return 0;
}
#endif