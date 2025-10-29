/*
LeetCode 3. Longest Substring Without Repeating Characters
Link: https://leetcode.com/problems/longest-substring-without-repeating-characters/

Question:
Given a string s, find the length of the longest substring without repeating characters.

Constraints:
- 0 <= s.length <= 5 * 10^4
- s consists of English letters, digits, symbols and spaces.
*/

#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    // Sliding window with last-seen index table (ASCII 256).
    // Move 'left' when a repeat is found to ensure the window stays unique.
    int lengthOfLongestSubstring(string s) {
        vector<int> last(256, -1);
        int best = 0;
        int left = 0;
        for (int i = 0; i < static_cast<int>(s.size()); ++i) {
            unsigned char c = static_cast<unsigned char>(s[i]);
            if (last[c] >= left) {
                left = last[c] + 1;
            }
            last[c] = i;
            int len = i - left + 1;
            if (len > best) best = len;
        }
        return best;
    }
};

/*
Approach:
- Maintain a sliding window [left..i] with no repeated characters.
- Track last seen index for each character; when encountering a repeat within the window,
  move 'left' to one past the previous occurrence.

Complexity:
- Time: O(n)
- Space: O(1) (fixed 256-size table)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    cout << sol.lengthOfLongestSubstring("abcabcbb") << "\n"; // 3 ("abc")
    cout << sol.lengthOfLongestSubstring("bbbbb") << "\n";    // 1 ("b")
    cout << sol.lengthOfLongestSubstring("pwwkew") << "\n";   // 3 ("wke")
    cout << sol.lengthOfLongestSubstring("") << "\n";         // 0
    return 0;
}
#endif