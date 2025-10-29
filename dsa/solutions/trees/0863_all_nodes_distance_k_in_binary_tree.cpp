/*
LeetCode 863. All Nodes Distance K in Binary Tree
Link: https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/

Question:
Given the root of a binary tree, a target node, and an integer k, return a list of the values
of all nodes that have a distance k from the target node. The answer can be returned in any order.

Constraints:
- The number of nodes in the tree is in the range [1, 500].
- 0 <= Node.val <= 500

Approach (Parent pointers + BFS):
- First, do a DFS from root to record each node's parent in a hash map.
- Then run a BFS starting from the target, exploring up to distance k across three neighbors:
  left child, right child, and parent.
- When the BFS layer equals k, collect those nodes' values and return.

Complexity:
- Time: O(n), visit each node a constant number of times.
- Space: O(n) for parent map, visited set, and BFS queue.
*/

#include <vector>
#include <queue>
#include <unordered_map>
#include <unordered_set>

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
    static void buildParent(TreeNode* node, TreeNode* par, std::unordered_map<TreeNode*, TreeNode*>& parent) {
        if (!node) return;
        if (par) parent[node] = par;
        buildParent(node->left, node, parent);
        buildParent(node->right, node, parent);
    }
public:
    std::vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {
        std::vector<int> res;
        if (!root || !target) return res;

        std::unordered_map<TreeNode*, TreeNode*> parent;
        parent.reserve(512);
        buildParent(root, nullptr, parent);

        std::unordered_set<TreeNode*> vis;
        vis.reserve(512);
        std::queue<TreeNode*> q;
        q.push(target);
        vis.insert(target);

        int dist = 0;
        while (!q.empty()) {
            int sz = (int)q.size();
            if (dist == k) {
                // collect all current level nodes
                for (int i = 0; i < sz; ++i) {
                    TreeNode* node = q.front(); q.pop();
                    res.push_back(node->val);
                }
                return res;
            }
            for (int i = 0; i < sz; ++i) {
                TreeNode* cur = q.front(); q.pop();
                TreeNode* neigh;
                // left
                neigh = cur->left;
                if (neigh && vis.find(neigh) == vis.end()) { vis.insert(neigh); q.push(neigh); }
                // right
                neigh = cur->right;
                if (neigh && vis.find(neigh) == vis.end()) { vis.insert(neigh); q.push(neigh); }
                // parent
                auto it = parent.find(cur);
                if (it != parent.end()) {
                    neigh = it->second;
                    if (neigh && vis.find(neigh) == vis.end()) { vis.insert(neigh); q.push(neigh); }
                }
            }
            ++dist;
        }
        return res;
    }
};