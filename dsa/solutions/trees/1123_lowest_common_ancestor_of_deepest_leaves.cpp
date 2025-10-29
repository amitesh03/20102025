/*
LeetCode 1123. Lowest Common Ancestor of Deepest Leaves
Link: https://leetcode.com/problems/lowest-common-ancestor-of-deepest-leaves/

Question:
Given the root of a binary tree, return the lowest common ancestor (LCA) of its deepest leaves.

Constraints:
- The number of nodes in the tree is in the range [1, 1000].
- 0 <= Node.val <= 10^5

Approach (Post-order with depth aggregation):
- Perform a post-order traversal that returns a pair (lca_node, max_depth) for each subtree.
- For a node:
  - Get (left_lca, left_depth) from left child.
  - Get (right_lca, right_depth) from right child.
  - If left_depth == right_depth, current node is the LCA for deepest leaves in this subtree, and depth = left_depth + 1.
  - If left_depth > right_depth, propagate left_lca and depth = left_depth + 1.
  - Else propagate right_lca and depth = right_depth + 1.
- The final lca_node at root is the answer.

Complexity:
- Time: O(n), single traversal
- Space: O(h) recursion stack, where h is the tree height
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
private:
    static std::pair<TreeNode*, int> dfs(TreeNode* node);
public:
    TreeNode* lcaDeepestLeaves(TreeNode* root) {
        return dfs(root).first;
    }

private:
    // Returns {lca_node, max_depth} for the subtree
    static std::pair<TreeNode*, int> dfs(TreeNode* node) {
        if (!node) return {nullptr, 0};
        auto leftRes = dfs(node->left);
        TreeNode* lNode = leftRes.first;
        int lDepth = leftRes.second;
        auto rightRes = dfs(node->right);
        TreeNode* rNode = rightRes.first;
        int rDepth = rightRes.second;
        if (lDepth == rDepth) {
            return {node, lDepth + 1};
        } else if (lDepth > rDepth) {
            return {lNode, lDepth + 1};
        } else {
            return {rNode, rDepth + 1};
        }
    }
};