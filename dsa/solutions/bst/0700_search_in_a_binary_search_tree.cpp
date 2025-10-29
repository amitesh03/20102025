/*
LeetCode 700. Search in a Binary Search Tree
Link: https://leetcode.com/problems/search-in-a-binary-search-tree/

Question:
You are given the root of a Binary Search Tree (BST) and an integer val. Find the node in the BST
such that the node's value equals val and return the subtree rooted at that node. If such a node does
not exist, return nullptr.

Constraints:
- The number of nodes in the tree is in the range [1, 5000].
- -10^4 <= Node.val <= 10^4
- All node values are unique.
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
    TreeNode* searchBST(TreeNode* root, int val) {
        while (root && root->val != val) {
            root = (val < root->val) ? root->left : root->right;
        }
        return root;
    }
};

/*
Approach:
- Iteratively traverse the BST:
  - If val < root->val, go left; else go right; stop when root is null or root->val == val.

Complexity:
- Time: O(h), where h is the height of the BST (O(log n) average, O(n) worst-case skewed).
- Space: O(1)
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    // Build a simple BST:   2
    //                      / \
    //                     1   3
    TreeNode* n2 = new TreeNode(2);
    TreeNode* n1 = new TreeNode(1);
    TreeNode* n3 = new TreeNode(3);
    n2->left = n1; n2->right = n3;

    Solution sol;
    TreeNode* res = sol.searchBST(n2, 3);
    std::cout << (res ? res->val : -1) << "\n"; // 3

    // Cleanup
    delete n1; delete n3; delete n2;
    return 0;
}
#endif