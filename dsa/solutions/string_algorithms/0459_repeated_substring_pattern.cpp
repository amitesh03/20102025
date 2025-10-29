/*
LeetCode 459. Repeated Substring Pattern
Link: https://leetcode.com/problems/repeated-substring-pattern/

Question:
Given a string s, determine if it can be constructed by taking a substring of it and appending multiple copies of the substring together.

Constraints:
- 1 <= s.length <= 10^4
- s consists of lowercase English letters.

Approach:
- Doubling trick: Let t = s + s. If s is periodic, s will occur inside t at some position other than 0 and n (the trivial copies).
- Check pos = t.find(s, 1) and ensure pos != std::string::npos and pos != n.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#include <string>
#include <cstddef>

class Solution {
public:
    bool repeatedSubstringPattern(const std::string& s) {
        const std::size_t n = s.size();
        if (n <= 1) return false;
        std::string t = s + s;
        std::size_t pos = t.find(s, 1);
        return pos != std::string::npos && pos != n;
    }
};

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    std::cout << std::boolalpha;
    std::cout << sol.repeatedSubstringPattern("abab") << "\n"; // true
    std::cout << sol.repeatedSubstringPattern("aba") << "\n";  // false
    std::cout << sol.repeatedSubstringPattern("abcabcabc") << "\n"; // true
    std::cout << sol.repeatedSubstringPattern("a") << "\n";    // false
    return 0;
}
#endif