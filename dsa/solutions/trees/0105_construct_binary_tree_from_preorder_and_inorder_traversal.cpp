/*
LeetCode 105. Construct Binary Tree from Preorder and Inorder Traversal
Link: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/

Question:
Given two integer arrays preorder and inorder of length n where preorder is the preorder traversal of a binary tree
and inorder is the inorder traversal of the same tree, construct and return the binary tree.

Constraints:
- 1 <= n <= 3000
- preorder and inorder consist of unique values

Approach (Hash map + recursion with inorder boundaries):
- Use a hash map from value to its index in inorder to split left/right subtrees in O(1).
- Maintain a running index in preorder. Recursively pick preorder[preIdx] as root, split by inorder index, and build left then right.
- This constructs the tree in O(n).

Complexity:
- Time: O(n)
- Space: O(n) for the map and recursion stack
*/

#include <vector>
#include <unordered_map>

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
    std::unordered_map<int,int> pos;
    int preIdx;

    TreeNode* build(const std::vector<int>& preorder, int inL, int inR) {
        if (inL > inR) return nullptr;
        int rootVal = preorder[preIdx++];
        int k = pos[rootVal];
        TreeNode* left = build(preorder, inL, k - 1);
        TreeNode* right = build(preorder, k + 1, inR);
        return new TreeNode(rootVal, left, right);
    }

public:
    TreeNode* buildTree(std::vector<int>& preorder, std::vector<int>& inorder) {
        pos.clear();
        preIdx = 0;
        int n = (int)inorder.size();
        for (int i = 0; i < n; ++i) pos[inorder[i]] = i;
        return build(preorder, 0, n - 1);
    }
};