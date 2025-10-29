/*
LeetCode 232. Implement Queue using Stacks
Link: https://leetcode.com/problems/implement-queue-using-stacks/

Question:
Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support
all the functions of a normal queue (push, pop, peek, and empty).

Constraints:
- 1 <= number of operations <= 10^3
- -10^9 <= x <= 10^9
*/

#include <stack>
using namespace std;

class MyQueue {
public:
    MyQueue() {}

    void push(int x) {
        in.push(x);
    }

    int pop() {
        shift();
        int v = out.top();
        out.pop();
        return v;
    }

    int peek() {
        shift();
        return out.top();
    }

    bool empty() {
        return in.empty() && out.empty();
    }

private:
    stack<int> in, out;

    void shift() {
        if (out.empty()) {
            while (!in.empty()) {
                out.push(in.top());
                in.pop();
            }
        }
    }
};

/*
Approach:
- Maintain two stacks: 'in' for incoming pushes and 'out' for serving pops/peeks.
- On pop/peek, if 'out' is empty, move all elements from 'in' to 'out' to reverse order.
- This achieves amortized O(1) per operation.

Complexity:
- Time: Amortized O(1) per operation, worst-case O(n) during a shift.
- Space: O(n)
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    MyQueue q;
    q.push(1);
    q.push(2);
    std::cout << q.peek() << "\n"; // 1
    std::cout << q.pop() << "\n";  // 1
    std::cout << (q.empty() ? "true" : "false") << "\n"; // false
    std::cout << q.pop() << "\n";  // 2
    std::cout << (q.empty() ? "true" : "false") << "\n"; // true
    return 0;
}
#endif