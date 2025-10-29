/*
LeetCode 155. Min Stack
Link: https://leetcode.com/problems/min-stack/

Question:
Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.
Implement the MinStack class:
- MinStack() initializes the stack object.
- void push(int val) pushes val onto the stack.
- void pop() removes the top element.
- int top() gets the top element.
- int getMin() retrieves the minimum element in the stack.

Constraints:
- -2^31 <= val <= 2^31 - 1
- Methods will be called up to 3 * 10^5 times
*/

#include <iostream>
#include <stack>
#include <climits>
using namespace std;

class MinStack {
public:
    MinStack() {}

    void push(int val) {
        st.push(val);
        if (minSt.empty() || val <= minSt.top()) minSt.push(val);
    }

    void pop() {
        if (st.empty()) return;
        int v = st.top();
        st.pop();
        if (!minSt.empty() && v == minSt.top()) minSt.pop();
    }

    int top() {
        return st.top();
    }

    int getMin() {
        return minSt.top();
    }

private:
    stack<int> st;
    stack<int> minSt;
};

/*
Approach:
- Maintain two stacks: one for values, one for current minima. On push, also push to min stack when val <= current min; on pop, pop from min stack if the popped value equals min top.

Complexity:
- Time per operation: O(1)
- Space: O(n)
*/

#ifdef LOCAL_TEST
int main() {
    MinStack ms;
    ms.push(-2);
    ms.push(0);
    ms.push(-3);
    cout << ms.getMin() << "\n"; // -3
    ms.pop();
    cout << ms.top() << "\n";    // 0
    cout << ms.getMin() << "\n"; // -2
    return 0;
}
#endif