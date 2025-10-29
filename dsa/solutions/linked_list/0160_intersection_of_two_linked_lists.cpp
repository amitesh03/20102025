/*
LeetCode 160. Intersection of Two Linked Lists
Link: https://leetcode.com/problems/intersection-of-two-linked-lists/

Question:
Given the heads of two singly linked-lists headA and headB, return the node at which the two lists intersect.
If the two linked lists have no intersection, return null.

Constraints:
- The number of nodes of each list is in the range [0, 10^4].
- -10^5 <= Node.val <= 10^5
- The lists may intersect at some node, but if they do, the intersection is defined by reference, not value.
- Each list must be a valid singly-linked list.
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
    // Two-pointer switching technique:
    // Traverse both lists; when a pointer hits the end, redirect it to the head of the other list.
    // They will meet at the intersection or at null after at most length(A)+length(B) steps.
    ListNode* getIntersectionNode(ListNode* headA, ListNode* headB) {
        ListNode* a = headA;
        ListNode* b = headB;
        while (a != b) {
            a = (a == nullptr) ? headB : a->next;
            b = (b == nullptr) ? headA : b->next;
        }
        return a; // either intersection node or nullptr
    }
};

/*
Approach:
- Use two pointers that traverse both lists; by switching heads at ends, both pointers cover equal total lengths.
- If there is an intersection by reference, they will eventually point to the same node.

Complexity:
- Time: O(n + m)
- Space: O(1)
*/

#ifdef LOCAL_TEST
int main() {
    // Example setup:
    // list A: 4 -> 1 -> [8 -> 4 -> 5]
    // list B: 5 -> 6 -> 1 -> [8 -> 4 -> 5]
    ListNode* c3 = new ListNode(5);
    ListNode* c2 = new ListNode(4, c3);
    ListNode* c1 = new ListNode(8, c2);

    ListNode* a2 = new ListNode(1, c1);
    ListNode* a1 = new ListNode(4, a2);

    ListNode* b3 = new ListNode(1, c1);
    ListNode* b2 = new ListNode(6, b3);
    ListNode* b1 = new ListNode(5, b2);

    Solution sol;
    ListNode* inter = sol.getIntersectionNode(a1, b1);
    if (inter) {
        cout << "Intersection at value: " << inter->val << "\n"; // 8
    } else {
        cout << "No intersection\n";
    }

    // Cleanup: delete unique nodes; shared chain once
    delete a1; delete a2;
    delete b1; delete b2; delete b3; // b3 points into shared chain; already handled by deleting c1 chain
    delete c1; delete c2; delete c3;
    return 0;
}
#endif