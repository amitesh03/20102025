/*
LeetCode 159. Longest Substring with At Most Two Distinct Characters
Link: https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/

Question:
Given a string s, return the length of the longest substring that contains at most two distinct characters.

Constraints:
- 1 <= s.length <= 10^5
- s consists of ASCII characters

Approach (Sliding Window with distinct count):
- Maintain window [l..r] and frequency array for ASCII (size 256).
- Increase r; when a new char's freq becomes 1, distinct++.
- While distinct > 2, shrink l; when a char's freq drops to 0, distinct--.
- Track best length as max window size.

Complexity:
- Time: O(n)
- Space: O(1) for fixed-size arrays
*/

#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    int lengthOfLongestSubstringTwoDistinct(std::string s) {
        std::vector<int> freq(256, 0);
        int distinct = 0;
        int best = 0;
        int l = 0;
        for (int r = 0; r < (int)s.size(); ++r) {
            unsigned char c = static_cast<unsigned char>(s[r]);
            if (freq[c] == 0) ++distinct;
            ++freq[c];
            while (distinct > 2) {
                unsigned char cl = static_cast<unsigned char>(s[l]);
                --freq[cl];
                if (freq[cl] == 0) --distinct;
                ++l;
            }
            best = std::max(best, r - l + 1);
        }
        return best;
    }
};