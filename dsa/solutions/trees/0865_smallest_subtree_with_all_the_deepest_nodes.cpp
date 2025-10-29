/*
LeetCode 865. Smallest Subtree with all the Deepest Nodes
Link: https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes/

Question:
Given the root of a binary tree, return the smallest subtree that contains all the deepest nodes.
The result should be the root of that subtree.

Constraints:
- The number of nodes in the tree is in the range [1, 1000].
- 0 <= Node.val <= 10^5

Approach (Post-order with depth aggregation):
- For each subtree, compute a pair (subtree_root_for_deepest, depth_of_deepest).
- If left and right deepest depths are equal, current node is the answer for this subtree.
- Else, propagate the side with greater depth.
- The first component of the pair at the root is the final answer.

Complexity:
- Time: O(n), single traversal
- Space: O(h) recursion stack
*/

#include <cstddef>
#include <utility>

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
    TreeNode* subtreeWithAllDeepest(TreeNode* root) {
        std::pair<TreeNode*, int> res = dfs(root);
        return res.first;
    }
private:
    static std::pair<TreeNode*, int> dfs(TreeNode* node) {
        if (!node) return {nullptr, 0};
        std::pair<TreeNode*, int> leftRes = dfs(node->left);
        std::pair<TreeNode*, int> rightRes = dfs(node->right);
        if (leftRes.second == rightRes.second) {
            return {node, leftRes.second + 1};
        } else if (leftRes.second > rightRes.second) {
            return {leftRes.first, leftRes.second + 1};
        } else {
            return {rightRes.first, rightRes.second + 1};
        }
    }
};