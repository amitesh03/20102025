/*
LeetCode 234. Palindrome Linked List
Link: https://leetcode.com/problems/palindrome-linked-list/

Question:
Given the head of a singly linked list, return true if it is a palindrome or false otherwise.

Constraints:
- The number of nodes in the list is in the range [1, 10^5].
- 0 <= Node.val <= 9
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
    bool isPalindrome(ListNode* head) {
        if (!head || !head->next) return true;

        // 1) Find middle (slow at mid). If odd length, skip the middle.
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        if (fast) slow = slow->next; // odd length: move slow one step to skip center

        // 2) Reverse second half starting at slow
        ListNode* second = reverseList(slow);

        // 3) Compare halves
        ListNode* p1 = head;
        ListNode* p2 = second;
        bool ok = true;
        while (p2) { // second half is shorter or equal
            if (p1->val != p2->val) { ok = false; break; }
            p1 = p1->next;
            p2 = p2->next;
        }

        // 4) Optional: restore list (not required by LeetCode)
        reverseList(second);

        return ok;
    }

private:
    static ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* nxt = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nxt;
        }
        return prev;
    }
};

/*
Approach:
- Use fast/slow to find the middle; advance slow one extra step if odd length to skip the center.
- Reverse the second half, compare values, then optionally restore.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#ifdef LOCAL_TEST
int main() {
    // Build palindrome list: 1->2->2->1
    ListNode* n4 = new ListNode(1);
    ListNode* n3 = new ListNode(2, n4);
    ListNode* n2 = new ListNode(2, n3);
    ListNode* n1 = new ListNode(1, n2);

    Solution sol;
    cout << (sol.isPalindrome(n1) ? "true" : "false") << "\n"; // true

    // Cleanup
    while (n1) { ListNode* t = n1->next; delete n1; n1 = t; }
    return 0;
}
#endif