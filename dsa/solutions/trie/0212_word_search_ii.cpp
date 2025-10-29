/*
LeetCode 212. Word Search II
Link: https://leetcode.com/problems/word-search-ii/

Question:
Given an m x n board of characters and a list of strings words, return all words on the board.
Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are
horizontally or vertically neighboring. The same letter cell may not be used more than once per word.

Constraints:
- m == board.length, n == board[i].length
- 1 <= m, n <= 12
- 1 <= words.length <= 3 * 10^4
- 1 <= words[i].length <= 10
- board[i][j] and words[i][k] consist of lowercase English letters.
*/

#include <vector>
#include <string>
#include <cstddef>

class Solution {
private:
    struct Node {
        Node* child[26];
        const char* word; // pointer into original word storage; nullptr if none/found
        Node(): child{nullptr}, word(nullptr) {
            for (int i = 0; i < 26; ++i) child[i] = nullptr;
        }
    };

    static Node* buildTrie(const std::vector<std::string>& words) {
        Node* root = new Node();
        for (const auto& w : words) {
            Node* cur = root;
            for (char c : w) {
                int idx = c - 'a';
                if (idx < 0 || idx >= 26) { cur = nullptr; break; }
                if (!cur->child[idx]) cur->child[idx] = new Node();
                cur = cur->child[idx];
            }
            if (cur) cur->word = w.c_str(); // mark end; use pointer to avoid extra copies
        }
        return root;
    }

    static void dfs(std::vector<std::vector<char>>& board, int r, int c, Node* node, std::vector<std::string>& out) {
        char ch = board[r][c];
        if (ch == '#') return;
        int idx = ch - 'a';
        Node* nxt = (idx >= 0 && idx < 26) ? node->child[idx] : nullptr;
        if (!nxt) return;

        if (nxt->word) {
            out.emplace_back(nxt->word);
            nxt->word = nullptr; // avoid duplicates
        }

        board[r][c] = '#'; // mark visited

        int R = static_cast<int>(board.size());
        int C = static_cast<int>(board[0].size());
        if (r > 0)        dfs(board, r - 1, c, nxt, out);
        if (c > 0)        dfs(board, r, c - 1, nxt, out);
        if (r + 1 < R)    dfs(board, r + 1, c, nxt, out);
        if (c + 1 < C)    dfs(board, r, c + 1, nxt, out);

        board[r][c] = ch; // restore
    }

public:
    std::vector<std::string> findWords(std::vector<std::vector<char>>& board, std::vector<std::string>& words) {
        std::vector<std::string> ans;
        if (board.empty() || board[0].empty() || words.empty()) return ans;

        Node* root = buildTrie(words);
        int R = static_cast<int>(board.size());
        int C = static_cast<int>(board[0].size());

        for (int i = 0; i < R; ++i) {
            for (int j = 0; j < C; ++j) {
                dfs(board, i, j, root, ans);
            }
        }
        return ans;
    }
};

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    std::vector<std::vector<char>> board = {
        {'o','a','a','n'},
        {'e','t','a','e'},
        {'i','h','k','r'},
        {'i','f','l','v'}
    };
    std::vector<std::string> words = {"oath","pea","eat","rain"};
    Solution sol;
    auto res = sol.findWords(board, words);
    for (const auto& w : res) std::cout << w << " ";
    std::cout << "\n"; // Output contains "oath" and "eat"
    return 0;
}
#endif