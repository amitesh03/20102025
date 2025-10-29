/*
LeetCode 20. Valid Parentheses
Link: https://leetcode.com/problems/valid-parentheses/

Question:
Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. 
An input string is valid if:
- Open brackets are closed by the same type of brackets.
- Open brackets are closed in the correct order.

Constraints:
- 1 <= s.length <= 10^4
- s consists of parentheses only: '()[]{}'
*/

#include <iostream>
#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c=='(' || c=='[' || c=='{') {
                st.push(c);
            } else {
                if (st.empty()) return false;
                char t = st.top(); st.pop();
                if ((c==')' && t!='(') ||
                    (c==']' && t!='[') ||
                    (c=='}' && t!='{')) {
                    return false;
                }
            }
        }
        return st.empty();
    }
};

/*
Approach:
- Use a stack to push opening brackets; when encountering a closing bracket, check top matches.
Complexity:
- Time: O(n)
- Space: O(n) worst-case when all are opening brackets
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    cout << (sol.isValid("()") ? "true" : "false") << "\n"; // true
    cout << (sol.isValid("()[]{}") ? "true" : "false") << "\n"; // true
    cout << (sol.isValid("(]") ? "true" : "false") << "\n"; // false
    cout << (sol.isValid("([)]") ? "true" : "false") << "\n"; // false
    cout << (sol.isValid("{[]}") ? "true" : "false") << "\n"; // true
    return 0;
}
#endif