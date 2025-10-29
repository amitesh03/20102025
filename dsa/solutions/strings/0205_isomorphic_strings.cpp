/*
LeetCode 205. Isomorphic Strings
Link: https://leetcode.com/problems/isomorphic-strings/

Question:
Given two strings s and t, determine if they are isomorphic.
Two strings s and t are isomorphic if the characters in s can be replaced to get t.
All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.

Constraints:
- 1 <= s.length, t.length <= 5 * 10^4
- s and t consist of any valid ASCII characters.
*/

#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    // Bidirectional mapping using 256-size tables for ASCII.
    bool isIsomorphic(string s, string t) {
        if (s.size() != t.size()) return false;
        vector<int> mapST(256, -1);
        vector<int> mapTS(256, -1);
        for (int i = 0; i < static_cast<int>(s.size()); ++i) {
            unsigned char a = static_cast<unsigned char>(s[i]);
            unsigned char b = static_cast<unsigned char>(t[i]);
            if (mapST[a] == -1 && mapTS[b] == -1) {
                mapST[a] = b;
                mapTS[b] = a;
            } else {
                if (mapST[a] != b || mapTS[b] != a) return false;
            }
        }
        return true;
    }
};

/*
Approach:
- Maintain two mappings: s->t and t->s, both initialized to -1.
- For each position i, establish a new mapping if both are unset; otherwise, validate consistency.

Complexity:
- Time: O(n)
- Space: O(1) (fixed-size arrays)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    cout << (sol.isIsomorphic("egg", "add") ? "true" : "false") << "\n"; // true
    cout << (sol.isIsomorphic("foo", "bar") ? "true" : "false") << "\n"; // false
    cout << (sol.isIsomorphic("paper", "title") ? "true" : "false") << "\n"; // true
    cout << (sol.isIsomorphic("badc", "baba") ? "true" : "false") << "\n"; // false
    return 0;
}
#endif