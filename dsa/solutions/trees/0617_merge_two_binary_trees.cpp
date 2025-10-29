/*
LeetCode 617. Merge Two Binary Trees
Link: https://leetcode.com/problems/merge-two-binary-trees/

Question:
You are given two binary trees root1 and root2.
Merge the two trees into a new binary tree as follows:
- If two nodes overlap, then sum node values as the new value.
- Otherwise, the non-null node will be used as the node of the new tree.
Return the merged tree.

Constraints:
- The number of nodes in both trees is in the range [0, 2000].
- -10^4 <= Node.val <= 10^4
*/

#include <cstddef>

// Definition for a binary tree node.
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
    TreeNode* mergeTrees(TreeNode* root1, TreeNode* root2) {
        if (!root1) return root2;
        if (!root2) return root1;
        root1->val += root2->val;
        root1->left = mergeTrees(root1->left, root2->left);
        root1->right = mergeTrees(root1->right, root2->right);
        return root1;
    }
};

/*
Approach:
- Recursively merge the trees:
  - If either node is null, return the other.
  - Otherwise, sum values, and merge left and right children.
- This mutates root1 in-place and returns it, which is accepted by LeetCode.

Complexity:
- Time: O(n), where n is the total number of nodes across both trees.
- Space: O(h) recursion stack, where h is the height of the merged tree.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    // root1:    1           root2:   2
    //          / \                   / \
    //         3   2                 1   3
    //        /                           \ 
    //       5                             7
    TreeNode* r1 = new TreeNode(1, new TreeNode(3, new TreeNode(5), nullptr), new TreeNode(2));
    TreeNode* r2 = new TreeNode(2, new TreeNode(1, nullptr, new TreeNode(7)), new TreeNode(3));

    Solution sol;
    TreeNode* m = sol.mergeTrees(r1, r2);
    // Simple preorder print
    std::function<void(TreeNode*)> pre = [&](TreeNode* n){
        if (!n) { std::cout << "null "; return; }
        std::cout << n->val << ' '; pre(n->left); pre(n->right);
    };
    pre(m); std::cout << '\n';

    // Cleanup omitted
    return 0;
}
#endif