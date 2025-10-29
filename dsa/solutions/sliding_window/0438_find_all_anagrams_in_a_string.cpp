/*
LeetCode 438. Find All Anagrams in a String
Link: https://leetcode.com/problems/find-all-anagrams-in-a-string/

Question:
Given two strings s and p, return an array of all the start indices of p's anagrams in s.
You may return the answer in any order.

Constraints:
- 1 <= s.length, p.length <= 3 * 10^4
- s and p consist of lowercase English letters.

Approach (Sliding Window with frequency counts):
- Maintain a window of length |p| over s.
- Keep frequency arrays for the current window and for p (size 26).
- On each step, update the window frequencies by adding the incoming char and removing the outgoing char.
- If the two frequency arrays are equal, record the start index.

Complexity:
- Time: O(n * 26) which is O(n) since 26 is constant
- Space: O(26) for frequency arrays + O(k) for result indices
*/

#include <vector>
#include <string>

class Solution {
public:
    std::vector<int> findAnagrams(std::string s, std::string p) {
        int n = (int)s.size();
        int m = (int)p.size();
        if (n < m) return {};

        std::vector<int> need(26, 0), win(26, 0);
        for (int i = 0; i < m; ++i) {
            ++need[p[i] - 'a'];
            ++win[s[i] - 'a'];
        }

        std::vector<int> res;
        if (win == need) res.push_back(0);

        for (int i = m; i < n; ++i) {
            ++win[s[i] - 'a'];
            --win[s[i - m] - 'a'];
            if (win == need) res.push_back(i - m + 1);
        }
        return res;
    }
};