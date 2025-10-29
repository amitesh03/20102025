/*
LeetCode 647. Palindromic Substrings
Link: https://leetcode.com/problems/palindromic-substrings/

Question:
Given a string s, return the number of palindromic substrings in it.
A string is a palindrome when it reads the same backward as forward.
A substring is a contiguous sequence of characters within the string.

Constraints:
- 1 <= s.length <= 1000
- s consists of lowercase English letters.
*/

#include <iostream>
#include <string>
using namespace std;

class Solution {
public:
    int countSubstrings(string s) {
        int n = static_cast<int>(s.size());
        int count = 0;
        auto expand = [&](int l, int r) {
            while (l >= 0 && r < n && s[l] == s[r]) {
                ++count;
                --l;
                ++r;
            }
        };
        for (int i = 0; i < n; ++i) {
            expand(i, i);       // odd length
            expand(i, i + 1);   // even length
        }
        return count;
    }
};

/*
Approach:
- Expand around all possible centers (i for odd, i/i+1 for even) and count expansions while matching.
Complexity:
- Time: O(n^2)
- Space: O(1)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    cout << sol.countSubstrings("abc") << "\n";   // 3 ("a","b","c")
    cout << sol.countSubstrings("aaa") << "\n";   // 6 ("a","a","a","aa","aa","aaa")
    return 0;
}
#endif