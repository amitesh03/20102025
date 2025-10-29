/*
LeetCode 3. Longest Substring Without Repeating Characters
Link: https://leetcode.com/problems/longest-substring-without-repeating-characters/

Question:
Given a string s, find the length of the longest substring without repeating characters.

Constraints:
- 0 <= s.length <= 5 * 10^4
- s consists of English letters, digits, symbols and spaces

Approach (Sliding Window with last-seen index):
- Maintain window [l..r]. For each character, use an array last[256] to store last index seen.
- When encountering a repeated character whose last index >= l, move l to last+1.
- Update best length each step.

Complexity:
- Time: O(n)
- Space: O(1) (fixed 256 array)
*/

#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        std::vector<int> last(256, -1);
        int best = 0;
        int l = 0;
        for (int r = 0; r < (int)s.size(); ++r) {
            unsigned char c = static_cast<unsigned char>(s[r]);
            if (last[c] >= l) {
                l = last[c] + 1;
            }
            last[c] = r;
            best = std::max(best, r - l + 1);
        }
        return best;
    }
};