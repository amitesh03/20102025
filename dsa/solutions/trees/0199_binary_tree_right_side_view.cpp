/*
LeetCode 199. Binary Tree Right Side View
Link: https://leetcode.com/problems/binary-tree-right-side-view/

Question:
Given the root of a binary tree, imagine yourself standing on the right side of it,
return the values of the nodes you can see ordered from top to bottom.

Constraints:
- The number of nodes in the tree is in the range [0, 100].
- -100 <= Node.val <= 100

Approach (BFS level-order):
- Traverse the tree level by level using a queue.
- For each level, the rightmost node visited (i == sz-1) is visible from the right side.
- Collect those rightmost values and return them.

Complexity:
- Time: O(n), where n is the number of nodes.
- Space: O(n) for the queue and result.
*/

#include <vector>
#include <queue>

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
    std::vector<int> rightSideView(TreeNode* root) {
        std::vector<int> res;
        if (!root) return res;

        std::queue<TreeNode*> q;
        q.push(root);

        while (!q.empty()) {
            int sz = (int)q.size();
            for (int i = 0; i < sz; ++i) {
                TreeNode* node = q.front(); q.pop();
                if (i == sz - 1) res.push_back(node->val); // rightmost at this level
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
        }
        return res;
    }
};