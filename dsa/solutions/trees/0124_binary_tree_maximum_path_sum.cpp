/*
LeetCode 124. Binary Tree Maximum Path Sum
Link: https://leetcode.com/problems/binary-tree-maximum-path-sum/

Question:
Given the root of a binary tree, return the maximum path sum of any non-empty path. A path is a sequence of nodes where each pair of adjacent nodes has an edge connecting them and it may start and end at any nodes in the tree.

Constraints:
- The number of nodes in the tree is in the range [1, 3 * 10^4].
- -1000 <= Node.val <= 1000

Approach (DFS with max gain):
- For each node, compute the maximum "gain" that can be contributed to its parent: node->val + max(0, leftGain, rightGain).
- The best path that passes through this node is node->val + max(0, leftGain) + max(0, rightGain).
- Track a global maximum over all nodes while returning per-node gains to parent.

Complexity:
- Time: O(n) (visit each node once)
- Space: O(h) recursion stack (h = tree height)
*/

#include <algorithm>
#include <climits>

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
    int maxPathSum(TreeNode* root) {
        int best = INT_MIN;
        maxGain(root, best);
        return best;
    }
private:
    static int maxGain(TreeNode* node, int& best) {
        if (!node) return 0;
        int left = std::max(0, maxGain(node->left, best));
        int right = std::max(0, maxGain(node->right, best));
        best = std::max(best, node->val + left + right);
        return node->val + std::max(left, right);
    }
};