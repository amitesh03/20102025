/*
LeetCode 720. Longest Word in Dictionary
Link: https://leetcode.com/problems/longest-word-in-dictionary/

Question:
Given an array of strings words representing a dictionary, return the longest string in the dictionary that can be built
one character at a time by other words in the dictionary. If there is more than one possible answer, return the longest word
with the smallest lexicographical order. If no answer exists, return "".

Definition:
- A word is "buildable" if for every k in [1..len(word)], the prefix word[0..k-1] is in words.

Constraints:
- 1 <= words.length <= 1000
- 1 <= words[i].length <= 30
- words[i] consists of lowercase English letters.
*/

#include <vector>
#include <string>
#include <unordered_set>
#include <algorithm>

class Solution {
public:
    std::string longestWord(std::vector<std::string>& words) {
        // Sort by length ascending, then lex ascending so shorter prefixes are processed first
        std::sort(words.begin(), words.end(), [](const std::string& a, const std::string& b) {
            if (a.size() != b.size()) return a.size() < b.size();
            return a < b;
        });

        std::unordered_set<std::string> built;
        std::string ans;

        for (std::size_t i = 0; i < words.size(); ++i) {
            const std::string& w = words[i];
            if (w.size() == 1 || built.find(w.substr(0, w.size() - 1)) != built.end()) {
                built.insert(w);
                if (w.size() > ans.size() || (w.size() == ans.size() && w < ans)) {
                    ans = w;
                }
            }
        }
        return ans;
    }
};

/*
Approach:
- Sort words by increasing length, breaking ties lexicographically. Maintain a set of buildable words.
- A word w is buildable if its (len-1) prefix is already in set (or len==1).
- Update the answer on-the-fly, preferring longer words, and lexicographically smaller when equal length.

Complexity:
- Time: O(n log n + n * L) where n = words.size(), L = average word length (due to substr lookups).
- Space: O(n * L) for storing buildable words in the set.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    std::vector<std::string> words = {"w","wo","wor","worl","world","a","ap","app","appl","apple","apply"};
    Solution sol;
    std::cout << sol.longestWord(words) << "\n"; // "world" or "apple" depending on set; after sorting, "world"
    return 0;
}
#endif