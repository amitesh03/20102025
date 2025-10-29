/*
LeetCode 103. Binary Tree Zigzag Level Order Traversal
Link: https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/

Question:
Given the root of a binary tree, return the zigzag level order traversal of its nodes' values.
(ie, from left to right, then right to left for the next level and alternate between).

Constraints:
- The number of nodes in the tree is in the range [0, 2000].
- -1000 <= Node.val <= 1000

Approach (BFS with direction toggle):
- Perform a standard BFS using a queue to process nodes level by level.
- Maintain a boolean flag 'leftToRight' which flips each level.
- For each level, collect values in a temporary vector; if not leftToRight, reverse the vector before appending to result.
- Return the collected zigzag traversal.

Complexity:
- Time: O(n), visiting each node once; reversing each level costs O(levelSize) (overall still O(n)).
- Space: O(n) for queue and result storage.
*/

#include <vector>
#include <queue>
#include <algorithm>

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(): val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x): val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *l, TreeNode *r): val(x), left(l), right(r) {}
};

class Solution {
public:
    std::vector<std::vector<int>> zigzagLevelOrder(TreeNode* root) {
        std::vector<std::vector<int>> res;
        if (!root) return res;

        std::queue<TreeNode*> q;
        q.push(root);
        bool leftToRight = true;

        while (!q.empty()) {
            int sz = (int)q.size();
            std::vector<int> lvl;
            lvl.reserve(sz);
            for (int i = 0; i < sz; ++i) {
                TreeNode* node = q.front(); q.pop();
                lvl.push_back(node->val);
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            if (!leftToRight) {
                std::reverse(lvl.begin(), lvl.end());
            }
            res.push_back(std::move(lvl));
            leftToRight = !leftToRight;
        }

        return res;
    }
};