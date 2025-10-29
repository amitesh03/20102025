/*
LeetCode 214. Shortest Palindrome
Link: https://leetcode.com/problems/shortest-palindrome/

Question:
Given a string s, you can convert it to a palindrome by adding characters in front of it. Return the shortest palindrome you can find by performing this transformation.

Constraints:
- 0 <= s.length <= 5 * 10^4
- s consists of lowercase English letters only

Approach (KMP / prefix-function):
- We want the longest palindromic prefix of s.
- Build string t = s + '#' + reverse(s). The LPS (longest proper prefix also a suffix) of t's last position gives the length of the longest prefix of s that matches a suffix of reverse(s), i.e., the longest palindromic prefix length.
- Let p = LPS(t.back()). Then suffix = s[p..end]. Reverse suffix and prepend to s to form shortest palindrome.

Complexity:
- Time: O(n) to build LPS over t of size 2n+1
- Space: O(n) for LPS
*/

#include <string>
#include <algorithm>

class Solution {
public:
    std::string shortestPalindrome(std::string s) {
        int n = (int)s.size();
        if (n <= 1) return s;

        // Build reversed string and concatenated pattern t = s + '#' + reverse(s)
        std::string rs = s;
        std::reverse(rs.begin(), rs.end());
        std::string t;
        t.reserve(n * 2 + 1);
        t += s;
        t.push_back('#');
        t += rs;

        // KMP LPS array using raw dynamic allocation to avoid STL vector methods
        size_t m = t.size();
        int* lps = new int[m];
        for (size_t i = 0; i < m; ++i) lps[i] = 0;

        int len = 0;
        for (size_t i = 1; i < m; ++i) {
            while (len > 0 && t[i] != t[len]) {
                len = lps[(size_t)len - 1];
            }
            if (t[i] == t[len]) {
                ++len;
            }
            lps[i] = len;
        }

        int palLen = lps[m - 1];
        delete[] lps;

        std::string suffix = s.substr((size_t)palLen);
        std::reverse(suffix.begin(), suffix.end());
        return suffix + s;
    }
};