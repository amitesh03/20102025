/*
LeetCode 543. Diameter of Binary Tree
Link: https://leetcode.com/problems/diameter-of-binary-tree/

Question:
Given the root of a binary tree, return the length of the diameter of the tree.
The diameter is the length of the longest path between any two nodes in the tree.
This path may or may not pass through the root.

Constraints:
- The number of nodes is in the range [1, 10^4].
- -100 <= Node.val <= 100
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
    int diameterOfBinaryTree(TreeNode* root) {
        int best = 0;
        depth(root, best);
        return best;
    }
private:
    static int depth(TreeNode* node, int& best) {
        if (!node) return 0;
        int left = depth(node->left, best);
        int right = depth(node->right, best);
        int cand = left + right;
        if (cand > best) best = cand;
        return 1 + (left > right ? left : right);
    }
};

/*
Approach:
- Use post-order recursion: compute depths of left and right subtrees. At each node, diameter
  candidate is leftDepth + rightDepth. Track the maximum across all nodes.

Complexity:
- Time: O(n)
- Space: O(h) recursion stack, h = tree height
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    TreeNode* n7 = new TreeNode(7);
    TreeNode* n4 = new TreeNode(4);
    TreeNode* n5 = new TreeNode(5, n7, nullptr);
    TreeNode* n2 = new TreeNode(2, n4, n5);
    TreeNode* n3 = new TreeNode(3);
    TreeNode* root = new TreeNode(1, n2, n3);

    Solution sol;
    std::cout << sol.diameterOfBinaryTree(root) << "\n"; // 4 (path 7-5-2-1-3)

    // Cleanup
    delete n7; delete n4; delete n5; delete n2; delete n3; delete root;
    return 0;
}
#endif