/*
LeetCode 139. Word Break
Link: https://leetcode.com/problems/word-break/

Question:
Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a sequence of
one or more dictionary words.
Note that the same word may be reused multiple times in the segmentation.

Constraints:
- 1 <= s.length <= 300
- 1 <= wordDict.length <= 1000
- 1 <= wordDict[i].length <= 20
- s and wordDict[i] consist of only lowercase English letters
*/

#include <iostream>
#include <string>
#include <vector>
#include <unordered_set>
using namespace std;

class Solution {
public:
    // DP: dp[i] = true if s[0..i) can be segmented. Try next word lengths from i.
    bool wordBreak(string s, vector<string>& wordDict) {
        int n = static_cast<int>(s.size());
        unordered_set<string> dict;
        dict.reserve(wordDict.size() * 2);
        size_t maxLen = 0;
        for (const string& w : wordDict) {
            dict.insert(w);
            if (w.size() > maxLen) maxLen = w.size();
        }
        vector<char> dp(n + 1, 0);
        dp[0] = 1;
        for (int i = 0; i < n; ++i) {
            if (!dp[i]) continue;
            // limit next length to maxLen to avoid unnecessary checks
            for (int len = 1; len <= static_cast<int>(maxLen) && i + len <= n; ++len) {
                if (dict.find(s.substr(i, len)) != dict.end()) {
                    dp[i + len] = 1;
                }
            }
        }
        return dp[n] != 0;
    }
};

/*
Approach:
- Use dynamic programming where dp[i] indicates s[0..i) is segmentable.
- Precompute max word length to cap inner loop; use unordered_set for O(1) expected lookups.

Complexity:
- Time: O(n * L) substring creation cost; acceptable for constraints (n<=300, L<=20).
- Space: O(n) + O(dict)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<string> dict = {"leet","code"};
    cout << (sol.wordBreak("leetcode", dict) ? "true" : "false") << "\n"; // true
    vector<string> dict2 = {"a","aa","aaa","aaaa"};
    cout << (sol.wordBreak("aaaaaaa", dict2) ? "true" : "false") << "\n"; // true
    vector<string> dict3 = {"cats","dog","sand","and","cat"};
    cout << (sol.wordBreak("catsandog", dict3) ? "true" : "false") << "\n"; // false
    return 0;
}
#endif