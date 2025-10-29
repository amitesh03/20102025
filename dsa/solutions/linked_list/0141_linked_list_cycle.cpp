/*
LeetCode 141. Linked List Cycle
Link: https://leetcode.com/problems/linked-list-cycle/

Question:
Given the head of a linked list, determine if the linked list has a cycle.

Constraints:
- The number of nodes in the list is in the range [0, 10^4].
- -10^5 <= Node.val <= 10^5
- pos is -1 or the index of the node that tail connects to
*/

#include <iostream>
using namespace std;

// Definition for singly-linked list (LeetCode-style).
struct ListNode {
    int val;
    ListNode* next;
    ListNode(): val(0), next(nullptr) {}
    ListNode(int x): val(x), next(nullptr) {}
    ListNode(int x, ListNode* n): val(x), next(n) {}
};

class Solution {
public:
    // Floyd's Tortoise and Hare algorithm.
    bool hasCycle(ListNode* head) {
        if (!head || !head->next) return false;
        ListNode* slow = head;
        ListNode* fast = head->next;
        while (fast && fast->next) {
            if (slow == fast) return true;
            slow = slow->next;
            fast = fast->next->next;
        }
        return false;
    }
};

/*
Approach:
- Move 'slow' by 1 and 'fast' by 2. If they meet, a cycle exists; if 'fast' reaches null, no cycle.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#ifdef LOCAL_TEST
int main() {
    // Create a cycle: 3->2->0->-4 -> back to 2
    ListNode* n4 = new ListNode(-4);
    ListNode* n0 = new ListNode(0, n4);
    ListNode* n2 = new ListNode(2, n0);
    ListNode* n3 = new ListNode(3, n2);
    n4->next = n2; // cycle

    Solution sol;
    cout << (sol.hasCycle(n3) ? "true" : "false") << "\n"; // true

    // Break the cycle and test false
    n4->next = nullptr;
    cout << (sol.hasCycle(n3) ? "true" : "false") << "\n"; // false

    // Cleanup (now acyclic)
    while (n3) { ListNode* t = n3->next; delete n3; n3 = t; }
    return 0;
}
#endif