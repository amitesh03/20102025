/*
LeetCode 125. Valid Palindrome
Link: https://leetcode.com/problems/valid-palindrome/

Question:
Given a string s, determine if it is a palindrome, considering only alphanumeric characters
and ignoring cases.

Constraints:
- 1 <= s.length <= 2 * 10^5
- s consists of printable ASCII characters

Approach (Two Pointers):
- Use two pointers i (start) and j (end).
- Move i forward until s[i] is alphanumeric; move j backward until s[j] is alphanumeric.
- Compare lowercase versions of s[i] and s[j]; if they differ, return false.
- Continue until i >= j; return true.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#include <string>
#include <cctype>

class Solution {
public:
    bool isPalindrome(std::string s) {
        int i = 0, j = (int)s.size() - 1;
        while (i < j) {
            while (i < j && !std::isalnum(static_cast<unsigned char>(s[i]))) ++i;
            while (i < j && !std::isalnum(static_cast<unsigned char>(s[j]))) --j;
            if (i < j) {
                char a = std::tolower(static_cast<unsigned char>(s[i]));
                char b = std::tolower(static_cast<unsigned char>(s[j]));
                if (a != b) return false;
                ++i; --j;
            }
        }
        return true;
    }
};