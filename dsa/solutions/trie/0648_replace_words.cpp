/*
LeetCode 648. Replace Words
Link: https://leetcode.com/problems/replace-words/

Question:
In a language consisting of root words, also known as "dictionary roots," and words that consist of the root plus some additional characters,
replace all words in the sentence with the root forming it. If a word has more than one possible root, replace the word with the root with the shortest length.

Constraints:
- 1 <= dictionary.length <= 1000
- 1 <= dictionary[i].length <= 100
- 1 <= sentence.length <= 10^5
- dictionary[i] and sentence consist of lowercase English letters and spaces.
*/

#include <string>
#include <vector>
#include <cstddef>

class Solution {
private:
    struct Node {
        Node* child[26];
        bool end;
        Node(): child{nullptr}, end(false) {
            for (int i = 0; i < 26; ++i) child[i] = nullptr;
        }
    };
    Node* root = nullptr;

    void insert(const std::string& w) {
        if (!root) root = new Node();
        Node* cur = root;
        for (std::size_t i = 0; i < w.size(); ++i) {
            int idx = w[i] - 'a';
            if (idx < 0 || idx >= 26) return;
            if (!cur->child[idx]) cur->child[idx] = new Node();
            cur = cur->child[idx];
        }
        cur->end = true;
    }

    std::string shortestRoot(const std::string& w) const {
        const Node* cur = root;
        if (!cur) return "";
        std::string res;
        for (std::size_t i = 0; i < w.size(); ++i) {
            int idx = w[i] - 'a';
            if (idx < 0 || idx >= 26 || !cur->child[idx]) return "";
            res.push_back(w[i]);
            cur = cur->child[idx];
            if (cur->end) return res;
        }
        return "";
    }

public:
    std::string replaceWords(std::vector<std::string>& dictionary, std::string sentence) {
        // Build trie
        for (std::size_t i = 0; i < dictionary.size(); ++i) {
            insert(dictionary[i]);
        }
        // Process sentence
        std::string out;
        out.reserve(sentence.size());
        const std::size_t n = sentence.size();
        std::size_t i = 0;
        while (i < n) {
            // skip spaces (safe guard)
            if (sentence[i] == ' ') {
                out.push_back(' ');
                ++i;
                continue;
            }
            std::size_t j = i;
            while (j < n && sentence[j] != ' ') ++j;
            std::string word = sentence.substr(i, j - i);
            std::string rootWord = shortestRoot(word);
            if (!rootWord.empty()) out += rootWord;
            else out += word;
            if (j < n) out.push_back(' ');
            i = j + (j < n ? 1 : 0);
        }
        return out;
    }
};

/*
Approach:
- Build a 26-ary pointer-based trie from dictionary roots.
- For each token in the sentence, traverse trie to find the shortest root prefix; if found, replace; else keep original.

Complexity:
- Time: O(D * L + S) where D = dictionary.size(), L = average length of root, S = sentence length.
- Space: O(total characters in dictionary) for the trie.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    std::vector<std::string> dict = {"cat","bat","rat"};
    std::string sentence = "the cattle was rattled by the battery";
    Solution sol;
    std::cout << sol.replaceWords(dict, sentence) << "\n"; // "the cat was rat by the bat"
    return 0;
}
#endif