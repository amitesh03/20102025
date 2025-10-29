/*
LeetCode 1676. Lowest Common Ancestor of a Binary Tree IV
Link: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iv/

Question:
Given the root of a binary tree and an array of TreeNode pointers nodes, return the lowest common ancestor (LCA)
of all the nodes in nodes. All the nodes will exist in the tree, and all values are unique.

Constraints:
- The number of nodes in the tree is in the range [1, 10^4].
- -10^9 <= Node.val <= 10^9
- 2 <= nodes.length <= 10
- All nodes are unique and guaranteed to be present in the tree.

Approach (Post-order DFS with target counting):
- Insert all target nodes into an unordered_set for O(1) membership checks.
- DFS returns the count of target nodes found in the current subtree.
- At each node, compute total = leftCount + rightCount + (node in targets ? 1 : 0).
- The first node (in post-order from bottom-up) whose total equals the number of target nodes is the LCA.
- Store the first such node in 'ans' and optionally prune further recursion.

Complexity:
- Time: O(N) where N is the number of nodes (each node visited once)
- Space: O(H) recursion stack, H is the tree height, plus O(T) for the target set
*/

// Definition for a binary tree node (LeetCode compatible).
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(): val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x): val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* l, TreeNode* r): val(x), left(l), right(r) {}
};

#include <vector>
#include <unordered_set>

class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, std::vector<TreeNode*>& nodes) {
        targets.clear();
        for (TreeNode* p : nodes) targets.insert(p);
        need = static_cast<int>(targets.size());
        ans = nullptr;
        dfs(root);
        return ans;
    }
private:
    std::unordered_set<TreeNode*> targets;
    int need = 0;
    TreeNode* ans = nullptr;

    int dfs(TreeNode* node) {
        if (!node) return 0;
        if (ans) return 0; // optional pruning after LCA found
        int left = dfs(node->left);
        int right = dfs(node->right);
        int self = targets.count(node) ? 1 : 0;
        int total = left + right + self;
        if (!ans && total == need) {
            ans = node;
        }
        return total;
    }
};