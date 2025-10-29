/*
LeetCode 138. Copy List with Random Pointer
Link: https://leetcode.com/problems/copy-list-with-random-pointer/

Question:
A linked list of length n is given such that each node contains an additional random pointer,
which can point to any node in the list or null. Return a deep copy (clone) of the list.

Constraints:
- 0 <= n <= 10^5
- Node.val is in range [-10^5, 10^5]
*/

#include <iostream>
using namespace std;

// Definition for a Node (LeetCode-style).
struct Node {
    int val;
    Node* next;
    Node* random;
    Node(): val(0), next(nullptr), random(nullptr) {}
    Node(int _val): val(_val), next(nullptr), random(nullptr) {}
    Node(int _val, Node* _next, Node* _random): val(_val), next(_next), random(_random) {}
};

class Solution {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return nullptr;

        // 1) Interleave cloned nodes: A->A'->B->B'->...
        for (Node* cur = head; cur; cur = cur->next->next) {
            Node* copy = new Node(cur->val);
            copy->next = cur->next;
            cur->next = copy;
        }

        // 2) Assign random pointers for clones using original's random
        for (Node* cur = head; cur; cur = cur->next->next) {
            if (cur->random) {
                cur->next->random = cur->random->next;
            }
        }

        // 3) Detach the cloned list and restore original
        Node* dummy = new Node(0);
        Node* tail = dummy;
        Node* cur = head;
        while (cur) {
            Node* copy = cur->next;
            Node* nextOrig = copy->next;

            // Append copy
            tail->next = copy;
            tail = copy;

            // Restore original
            cur->next = nextOrig;
            cur = nextOrig;
        }

        Node* res = dummy->next;
        delete dummy;
        return res;
    }
};

/*
Approach:
- Interleave clones next to originals to easily set random via random->next.
- Set each copy's random pointer.
- Detach the clone list while restoring original next pointers.

Complexity:
- Time: O(n)
- Space: O(1) extra (excluding output list)
*/

#ifdef LOCAL_TEST
// Helper to print list (val and random's val)
void printList(Node* head) {
    Node* cur = head;
    while (cur) {
        cout << "val=" << cur->val << ", random=";
        if (cur->random) cout << cur->random->val;
        else cout << "null";
        cout << "\n";
        cur = cur->next;
    }
}

int main() {
    // Build sample: 7->13->11->10->1 with some random links
    Node* n5 = new Node(1);
    Node* n4 = new Node(10, n5, nullptr);
    Node* n3 = new Node(11, n4, nullptr);
    Node* n2 = new Node(13, n3, nullptr);
    Node* n1 = new Node(7, n2, nullptr);
    // Set randoms
    n1->random = nullptr;
    n2->random = n1;
    n3->random = n5;
    n4->random = n3;
    n5->random = n1;

    cout << "Original:\n";
    printList(n1);
    Solution sol;
    Node* copied = sol.copyRandomList(n1);
    cout << "Copied:\n";
    printList(copied);

    // Cleanup originals and copies (skipped for brevity)
    return 0;
}
#endif