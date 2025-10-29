/*
LeetCode 225. Implement Stack using Queues
Link: https://leetcode.com/problems/implement-stack-using-queues/

Question:
Design a stack that supports push, pop, top, and empty operations using only queue operations.
Implement the MyStack class with:
- void push(int x)
- int pop()
- int top()
- bool empty()

Constraints:
- 1 <= number of operations <= 10^3
- -10^9 <= x <= 10^9
*/

#include <queue>
#include <cstddef>
using namespace std;

class MyStack {
public:
    MyStack() {}

    void push(int x) {
        q.push(x);
        // rotate the queue to move new element to front
        for (size_t i = 0, n = q.size(); i + 1 < n; ++i) {
            q.push(q.front());
            q.pop();
        }
    }

    int pop() {
        int v = q.front();
        q.pop();
        return v;
    }

    int top() {
        return q.front();
    }

    bool empty() {
        return q.empty();
    }

private:
    queue<int> q;
};

/*
Approach:
- Single-queue technique: push, then rotate previous elements behind it so it becomes front.
Complexity:
- Each push: O(n) due to rotation; pop/top/empty: O(1) amortized.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    MyStack st;
    st.push(1);
    st.push(2);
    std::cout << st.top() << "\n"; // 2
    std::cout << st.pop() << "\n"; // 2
    std::cout << (st.empty() ? "true" : "false") << "\n"; // false
    std::cout << st.pop() << "\n"; // 1
    std::cout << (st.empty() ? "true" : "false") << "\n"; // true
    return 0;
}
#endif