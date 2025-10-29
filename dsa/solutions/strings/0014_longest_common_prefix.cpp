/*
LeetCode 14. Longest Common Prefix
Link: https://leetcode.com/problems/longest-common-prefix/

Question:
Write a function to find the longest common prefix string amongst an array of strings.
If there is no common prefix, return an empty string "".

Constraints:
- 1 <= strs.length <= 200
- 0 <= strs[i].length <= 200
- strs[i] consists of only lowercase English letters.
*/

#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    // Trim the running prefix against each string by comparing characters.
    string longestCommonPrefix(vector<string>& strs) {
        if (strs.empty()) return "";
        string prefix = strs[0];
        for (int i = 1; i < static_cast<int>(strs.size()); ++i) {
            int j = 0;
            int m = static_cast<int>(min(prefix.size(), strs[i].size()));
            while (j < m && prefix[j] == strs[i][j]) {
                ++j;
            }
            prefix = prefix.substr(0, j);
            if (prefix.empty()) return "";
        }
        return prefix;
    }
};

/*
Approach:
- Maintain a running prefix initialized to the first string.
- For each subsequent string, compare char-by-char and trim the prefix length to the match.

Complexity:
- Time: O(N * L) where N is number of strings and L is the prefix length bound
- Space: O(1) extra (excluding input and output)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<string> a = {"flower","flow","flight"};
    cout << sol.longestCommonPrefix(a) << "\n"; // "fl"

    vector<string> b = {"dog","racecar","car"};
    cout << sol.longestCommonPrefix(b) << "\n"; // ""

    vector<string> c = {""};
    cout << sol.longestCommonPrefix(c) << "\n"; // ""

    vector<string> d = {"a"};
    cout << sol.longestCommonPrefix(d) << "\n"; // "a"
    return 0;
}
#endif