/*
LeetCode 127. Word Ladder
Link: https://leetcode.com/problems/word-ladder/

Question:
Given two words beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, such that:
- Only one letter can be changed at a time
- Each transformed word must exist in the wordList
If no such sequence, return 0.

Constraints:
- 1 <= beginWord.length == endWord.length <= 10
- 1 <= wordList.length <= 5000
- All words consist of lowercase English letters

Approach (BFS over word graph implicit edges):
- Insert all words into an unordered_set for O(1) presence checks.
- If endWord is not in the set, return 0 early.
- BFS starting from beginWord; for each popped word, try changing each character 'a'..'z' to generate neighbors.
- When a neighbor exists in dict, erase it and push to queue to avoid revisits.
- The BFS level number is the path length; return when endWord is reached.

Complexity:
- Time: O(L * 26 * N) where L is word length, N is wordList size
- Space: O(N)
*/

#include <string>
#include <vector>
#include <unordered_set>
#include <queue>

class Solution {
public:
    int ladderLength(std::string beginWord, std::string endWord, std::vector<std::string>& wordList) {
        if (beginWord == endWord) return 1;
        std::unordered_set<std::string> dict(wordList.begin(), wordList.end());
        if (dict.find(endWord) == dict.end()) return 0;

        std::queue<std::string> q;
        q.push(beginWord);
        int steps = 1;
        // To prevent revisiting beginWord if it's in dict
        if (dict.find(beginWord) != dict.end()) dict.erase(beginWord);

        while (!q.empty()) {
            int sz = (int)q.size();
            for (int i = 0; i < sz; ++i) {
                std::string w = q.front(); q.pop();
                if (w == endWord) return steps;
                for (size_t pos = 0; pos < w.size(); ++pos) {
                    char orig = w[pos];
                    for (char c = 'a'; c <= 'z'; ++c) {
                        if (c == orig) continue;
                        w[pos] = c;
                        auto it = dict.find(w);
                        if (it != dict.end()) {
                            q.push(w);
                            dict.erase(it);
                        }
                    }
                    w[pos] = orig;
                }
            }
            ++steps;
        }
        return 0;
    }
};