/*
LeetCode 387. First Unique Character in a String
Link: https://leetcode.com/problems/first-unique-character-in-a-string/

Question:
Given a string s, find the first non-repeating character in it and return its index.
If it does not exist, return -1.

Constraints:
- 1 <= s.length <= 10^5
- s consists of only lowercase English letters.
*/

#include <iostream>
#include <string>
#include <array>
using namespace std;

class Solution {
public:
    int firstUniqChar(string s) {
        array<int, 26> cnt{}; // zero-initialized counts
        for (char c : s) ++cnt[c - 'a'];
        for (int i = 0; i < static_cast<int>(s.size()); ++i) {
            if (cnt[s[i] - 'a'] == 1) return i;
        }
        return -1;
    }
};

/*
Approach:
- Count frequency for 'a'..'z' using a fixed-size array, then scan again to find the first index with count==1.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    cout << sol.firstUniqChar("leetcode") << "\n";      // 0
    cout << sol.firstUniqChar("loveleetcode") << "\n";  // 2
    cout << sol.firstUniqChar("aabb") << "\n";          // -1
    return 0;
}
#endif