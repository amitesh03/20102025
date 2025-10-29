/*
LeetCode 692. Top K Frequent Words
Link: https://leetcode.com/problems/top-k-frequent-words/

Question:
Given an array of strings words and an integer k, return the k most frequent strings.
The output should be sorted by frequency descending; for equal frequency, by lexicographical order ascending.

Constraints:
- 1 <= words.length <= 5e4
- 1 <= words[i].length <= 10
- words[i] consists of lowercase English letters.
- 1 <= k <= number of unique words

Approach (Hash map + sort):
- Count frequencies in an unordered_map<string,int>.
- Move to a vector of pairs and sort by:
  - frequency descending
  - lexicographical order ascending
- Take first k words.

Complexity:
- Time: O(u log u) where u is the number of unique words
- Space: O(u) for the frequency map and list
*/

#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    std::vector<std::string> topKFrequent(std::vector<std::string>& words, int k) {
        std::unordered_map<std::string, int> freq;
        for (const auto& w : words) ++freq[w];

        std::vector<std::pair<std::string,int>> items;
        items.reserve(freq.size());
        for (const auto& p : freq) items.emplace_back(p.first, p.second);

        std::sort(items.begin(), items.end(),
                  [](const auto& a, const auto& b) {
                      if (a.second != b.second) return a.second > b.second; // higher freq first
                      return a.first < b.first; // lexicographically smaller first
                  });

        std::vector<std::string> res;
        res.reserve(k);
        for (int i = 0; i < k && i < static_cast<int>(items.size()); ++i) {
            res.push_back(items[i].first);
        }
        return res;
    }
};