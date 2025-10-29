/*
LeetCode 437. Path Sum III
Link: https://leetcode.com/problems/path-sum-iii/

Question:
Given the root of a binary tree and an integer targetSum, return the number of paths where the sum of the values
of the nodes in the path equals targetSum. A path does not need to start or end at the root or a leaf,
but it must go downwards (i.e., traveling only from parent nodes to child nodes).

Constraints:
- The number of nodes in the tree is in the range [0, 1000].
- -10^9 <= Node.val <= 10^9
- -1000 <= targetSum <= 1000
*/

#include <unordered_map>

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
    int pathSum(TreeNode* root, int targetSum) {
        std::unordered_map<long long, int> freq;
        freq[0] = 1; // base prefix for paths starting at root
        int count = 0;
        dfs(root, 0LL, targetSum, freq, count);
        return count;
    }

private:
    static void dfs(TreeNode* node, long long cur, long long target, std::unordered_map<long long,int>& freq, int& count) {
        if (!node) return;
        cur += node->val;

        // Count paths ending at current with sum == target: cur - target existed before
        long long need = cur - target;
        auto it = freq.find(need);
        if (it != freq.end()) count += it->second;

        // Add current prefix then recurse
        ++freq[cur];
        dfs(node->left, cur, target, freq, count);
        dfs(node->right, cur, target, freq, count);
        // Remove current prefix when backtracking
        if (--freq[cur] == 0) freq.erase(cur);
    }
};

/*
Approach:
- Use prefix-sum hashmap over root-to-node cumulative sums:
  - For each node with cumulative sum cur, number of valid paths ending at node equals freq[cur - target].
  - Maintain freq map along DFS path; increment on entry, decrement on backtrack.

Complexity:
- Time: O(n) average (unordered_map operations amortized O(1) per node)
- Space: O(h) to O(n) for recursion stack and hashmap in worst skewed trees
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    // Example: root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8 -> 3
    TreeNode* n3a = new TreeNode(3);
    TreeNode* n_2 = new TreeNode(-2);
    TreeNode* n3 = new TreeNode(3, n3a, n_2);
    TreeNode* n1 = new TreeNode(1);
    TreeNode* n2 = new TreeNode(2, nullptr, n1);
    TreeNode* n5 = new TreeNode(5, n3, n2);
    TreeNode* n11 = new TreeNode(11);
    TreeNode* n_3 = new TreeNode(-3, nullptr, n11);
    TreeNode* root = new TreeNode(10, n5, n_3);

    Solution sol;
    std::cout << sol.pathSum(root, 8) << "\n"; // 3

    // Cleanup (partial)
    delete n3a; delete n_2; delete n3; delete n1; delete n2; delete n5; delete n11; delete n_3; delete root;
    return 0;
}
#endif