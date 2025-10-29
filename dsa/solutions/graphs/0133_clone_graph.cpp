/*
LeetCode 133. Clone Graph
Link: https://leetcode.com/problems/clone-graph/

Question:
Given a reference of a node in a connected undirected graph.
Return a deep copy (clone) of the graph. Each node contains a val and a list of neighbors.

Constraints:
- The number of nodes in the graph is in the range [0, 100].
- 1 <= Node.val <= 100
- Node.val is unique for each node.
- There are no repeated edges and no self-loops in the graph.

Approach (BFS with hash map):
- Use unordered_map<Node*, Node*> to map original nodes to their clones.
- Start BFS from the given node, create clone on first sight, and wire neighbors accordingly.
- Return the clone of the input node.

Complexity:
- Time: O(V + E)
- Space: O(V)
*/

#include <vector>
#include <queue>
#include <unordered_map>

// Definition for a Node (as in LeetCode).
class Node {
public:
    int val;
    std::vector<Node*> neighbors;
    Node() : val(0), neighbors() {}
    Node(int _val) : val(_val), neighbors() {}
    Node(int _val, std::vector<Node*> _neighbors) : val(_val), neighbors(_neighbors) {}
};

class Solution {
public:
    Node* cloneGraph(Node* node) {
        if (node == nullptr) return nullptr;

        std::unordered_map<Node*, Node*> mp;
        std::queue<Node*> q;

        mp[node] = new Node(node->val);
        q.push(node);

        while (!q.empty()) {
            Node* u = q.front();
            q.pop();

            for (size_t i = 0; i < u->neighbors.size(); ++i) {
                Node* v = u->neighbors[i];
                if (mp.find(v) == mp.end()) {
                    mp[v] = new Node(v->val);
                    q.push(v);
                }
                mp[u]->neighbors.push_back(mp[v]);
            }
        }

        return mp[node];
    }
};