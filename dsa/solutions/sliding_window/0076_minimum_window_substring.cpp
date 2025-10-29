/*
LeetCode 76. Minimum Window Substring
Link: https://leetcode.com/problems/minimum-window-substring/

Question:
Given two strings s and t, return the minimum window substring of s such that every
character in t (including duplicates) is included in the window. If no such substring
exists, return the empty string "".

Constraints:
- 1 <= s.length, t.length <= 10^5
- s and t consist of ASCII characters

Approach (Sliding Window with counts):
- Count required occurrences for each character of t in an array need[128].
- Expand right pointer r; when including a needed char that is still missing, decrement remain.
- Shrink left pointer l while remain == 0, updating the best window; when removing a needed char
  causes have[c] < need[c], increment remain.

Complexity:
- Time: O(|s| + |t|)
- Space: O(1) for fixed-size ASCII arrays
*/

#include <string>
#include <climits>

class Solution {
public:
    std::string minWindow(std::string s, std::string t) {
        if (t.empty()) return "";
        int need[128] = {0};
        for (char ch : t) need[(unsigned char)ch]++; 
        int have[128] = {0};
        int remain = (int)t.size();
        int l = 0;
        int bestLen = INT_MAX;
        int bestL = 0;
        for (int r = 0; r < (int)s.size(); ++r) {
            unsigned char c = static_cast<unsigned char>(s[r]);
            if (need[c] > 0) {
                if (have[c] < need[c]) --remain;
                ++have[c];
            } else {
                ++have[c];
            }
            while (remain == 0) {
                if (r - l + 1 < bestLen) {
                    bestLen = r - l + 1;
                    bestL = l;
                }
                unsigned char cl = static_cast<unsigned char>(s[l]);
                if (need[cl] > 0) {
                    if (have[cl] <= need[cl]) {
                        ++remain;
                    }
                    --have[cl];
                } else {
                    --have[cl];
                }
                ++l;
            }
        }
        return bestLen == INT_MAX ? std::string() : s.substr(bestL, bestLen);
    }
};