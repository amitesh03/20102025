/*
LeetCode 28. Implement strStr()
Link: https://leetcode.com/problems/implement-strstr/

Question:
Given two strings needle and haystack, return the index of the first occurrence of needle in haystack,
or -1 if needle is not part of haystack. If needle is an empty string, return 0.

Constraints:
- 0 <= haystack.length, needle.length <= 5 * 10^4
- haystack and needle consist of only lowercase English characters.
*/

#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    // KMP (Knuth-Morris-Pratt) pattern matching.
    // Build LPS (longest proper prefix which is also suffix) for 'needle', then scan 'haystack'.
    int strStr(string haystack, string needle) {
        if (needle.empty()) return 0;
        int n = static_cast<int>(needle.size());
        int m = static_cast<int>(haystack.size());
        if (n > m) return -1;

        // Build LPS array for needle
        vector<int> lps(n, 0);
        for (int i = 1, len = 0; i < n; ) {
            if (needle[i] == needle[len]) {
                lps[i++] = ++len;
            } else if (len > 0) {
                len = lps[len - 1];
            } else {
                lps[i++] = 0;
            }
        }

        // KMP search
        for (int i = 0, j = 0; i < m; ) {
            if (haystack[i] == needle[j]) {
                ++i; ++j;
                if (j == n) return i - n;
            } else if (j > 0) {
                j = lps[j - 1];
            } else {
                ++i;
            }
        }
        return -1;
    }
};

/*
Approach:
- Precompute LPS for needle; while scanning haystack, use LPS to avoid re-checking characters.

Complexity:
- Time: O(m + n)
- Space: O(n) for LPS
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    cout << sol.strStr("sadbutsad", "sad") << "\n"; // 0
    cout << sol.strStr("leetcode", "leeto") << "\n"; // -1
    cout << sol.strStr("aaaaa", "bba") << "\n"; // -1
    cout << sol.strStr("hello", "ll") << "\n"; // 2
    cout << sol.strStr("a", "a") << "\n"; // 0
    return 0;
}
#endif