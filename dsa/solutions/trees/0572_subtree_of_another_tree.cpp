/*
LeetCode 572. Subtree of Another Tree
Link: https://leetcode.com/problems/subtree-of-another-tree/

Question:
Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same
structure and node values as subRoot. A subtree of a binary tree tree is a tree that consists of a node in tree
and all of this node's descendants. The tree can also be considered as a subtree of itself.

Constraints:
- The number of nodes in root is in the range [0, 2000].
- The number of nodes in subRoot is in the range [0, 1000].
- -10^4 <= Node.val <= 10^4
*/

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(): val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x): val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* l, TreeNode* r): val(x), left(l), right(r) {}
};

class Solution {
public:
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        if (!subRoot) return true; // empty tree is subtree
        return traverse(root, subRoot);
    }
private:
    static bool traverse(TreeNode* root, TreeNode* subRoot) {
        if (!root) return false;
        if (isSame(root, subRoot)) return true;
        return traverse(root->left, subRoot) || traverse(root->right, subRoot);
    }
    static bool isSame(TreeNode* a, TreeNode* b) {
        if (!a && !b) return true;
        if (!a || !b) return false;
        if (a->val != b->val) return false;
        return isSame(a->left, b->left) && isSame(a->right, b->right);
    }
};

/*
Approach:
- Traverse root and at each node check structural/value equality with subRoot via isSame.

Complexity:
- Time: O(n * m) worst-case when many nodes share the same value; average better on diverse trees.
- Space: O(h) for recursion stack (h = height of tree).
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    TreeNode* sL = new TreeNode(4);
    TreeNode* sR = new TreeNode(5);
    TreeNode* s = new TreeNode(2, sL, sR);

    TreeNode* rL = new TreeNode(4);
    TreeNode* rR = new TreeNode(5);
    TreeNode* r2 = new TreeNode(2, rL, rR);
    TreeNode* root = new TreeNode(1, r2, new TreeNode(3));

    Solution sol;
    std::cout << std::boolalpha << sol.isSubtree(root, s) << "\n"; // true

    // Cleanup omitted for brevity
    return 0;
}
#endif