/*
LeetCode 76. Minimum Window Substring
Link: https://leetcode.com/problems/minimum-window-substring/

Question:
Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If no such substring exists, return the empty string "".

Constraints:
- 1 <= s.length, t.length <= 10^5
- s and t consist of English letters.
*/

#include <iostream>
#include <string>
#include <vector>
#include <climits>
using namespace std;

class Solution {
public:
    // Sliding window with frequency counting; track how many characters meet required counts.
    string minWindow(string s, string t) {
        int n = static_cast<int>(s.size());
        int m = static_cast<int>(t.size());
        if (m == 0) return "";
        if (n < m) return "";

        vector<int> need(256, 0);
        vector<int> have(256, 0);
        int required = 0;
        for (int i = 0; i < m; ++i) {
            unsigned char c = static_cast<unsigned char>(t[i]);
            if (need[c] == 0) ++required;
            ++need[c];
        }

        int formed = 0;
        int bestLen = INT_MAX;
        int bestL = 0;
        for (int l = 0, r = 0; r < n; ++r) {
            unsigned char rc = static_cast<unsigned char>(s[r]);
            ++have[rc];
            if (need[rc] > 0 && have[rc] == need[rc]) {
                ++formed;
            }
            while (formed == required && l <= r) {
                int len = r - l + 1;
                if (len < bestLen) {
                    bestLen = len;
                    bestL = l;
                }
                unsigned char lc = static_cast<unsigned char>(s[l]);
                --have[lc];
                if (need[lc] > 0 && have[lc] < need[lc]) {
                    --formed;
                }
                ++l;
            }
        }
        if (bestLen == INT_MAX) return "";
        return s.substr(bestL, bestLen);
    }
};

/*
Approach:
- Count required frequencies for t. Slide right pointer; when window covers all required counts, slide left to minimize while maintaining coverage.

Complexity:
- Time: O(n + m)
- Space: O(1) (fixed-size arrays for ASCII)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    cout << sol.minWindow("ADOBECODEBANC", "ABC") << "\n"; // "BANC"
    cout << sol.minWindow("a", "a") << "\n"; // "a"
    cout << sol.minWindow("a", "aa") << "\n"; // ""
    return 0;
}
#endif