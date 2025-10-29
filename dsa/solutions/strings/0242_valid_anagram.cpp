/*
LeetCode 242. Valid Anagram
Link: https://leetcode.com/problems/valid-anagram/

Question:
Given two strings s and t, return true if t is an anagram of s, and false otherwise.

Constraints:
- 1 <= s.length, t.length <= 5 * 10^4
- s and t consist of lowercase English letters.
*/

#include <iostream>
#include <string>
#include <array>
using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) return false;
        array<int, 26> cnt{}; // zero-initialized
        for (char c : s) {
            cnt[c - 'a']++;
        }
        for (char c : t) {
            cnt[c - 'a']--;
        }
        for (int x : cnt) {
            if (x != 0) return false;
        }
        return true;
    }
};

/*
Approach:
- Count character frequencies with a fixed-size array for 'a'..'z'. Compare counts.

Complexity:
- Time: O(n)
- Space: O(1)

Note: For full Unicode handling, use an unordered_map-based approach over code points.
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    cout << (sol.isAnagram("anagram", "nagaram") ? "true" : "false") << "\n"; // true
    cout << (sol.isAnagram("rat", "car") ? "true" : "false") << "\n"; // false
    return 0;
}
#endif