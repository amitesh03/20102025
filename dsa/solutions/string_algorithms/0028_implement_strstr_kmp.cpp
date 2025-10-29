/*
LeetCode 28. Implement strStr() — KMP (Knuth–Morris–Pratt)
Link: https://leetcode.com/problems/implement-strstr/

Question:
Given two strings haystack and needle, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.

Constraints:
- 1 <= haystack.length, needle.length <= 5 * 10^4
- haystack and needle consist of lowercase English letters.

Approach (KMP):
- Build the prefix-function (LPS array) for needle: lps[i] = length of the longest proper prefix equal to a suffix ending at i.
- Scan haystack while advancing j on matches; on mismatch, jump j = lps[j-1] instead of restarting from 0.
- Returns earliest match index; empty needle returns 0.

Complexity:
- Time: O(n + m)
- Space: O(m)
*/

#include <string>
#include <vector>
#include <cstddef>

class Solution {
public:
    int strStr(std::string haystack, std::string needle) {
        if (needle.empty()) return 0;
        int n = static_cast<int>(haystack.size());
        int m = static_cast<int>(needle.size());
        if (m > n) return -1;

        // Build LPS (Longest Proper Prefix which is also Suffix)
        std::vector<int> lps(m, 0);
        for (int i = 1, len = 0; i < m; ) {
            if (needle[i] == needle[len]) {
                lps[i++] = ++len;
            } else if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i++] = 0;
            }
        }

        // Search using LPS
        for (int i = 0, j = 0; i < n; ) {
            if (haystack[i] == needle[j]) {
                ++i; ++j;
                if (j == m) return i - m;
            } else if (j != 0) {
                j = lps[j - 1];
            } else {
                ++i;
            }
        }
        return -1;
    }
};

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    std::cout << sol.strStr("sadbutsad", "sad") << "\n"; // 0
    std::cout << sol.strStr("leetcode", "leeto") << "\n"; // -1
    std::cout << sol.strStr("aaaaa", "bba") << "\n"; // -1
    std::cout << sol.strStr("abc", "") << "\n"; // 0
    return 0;
}
#endif