/*
LeetCode 150. Evaluate Reverse Polish Notation
Link: https://leetcode.com/problems/evaluate-reverse-polish-notation/

Question:
Evaluate the value of an arithmetic expression in Reverse Polish Notation.
Valid operators are +, -, *, and /. Each operand may be an integer or another expression.
Note that division between two integers should truncate toward zero.

Constraints:
- 1 <= tokens.length <= 10^4
- tokens[i] is an integer or one of "+", "-", "*", "/"
- The division between two integers always truncates toward zero.
- The given RPN expression is always valid.
*/

#include <iostream>
#include <vector>
#include <string>
#include <stack>
#include <cstddef>

class Solution {
public:
    int evalRPN(std::vector<std::string>& tokens) {
        std::stack<long long> st;
        for (std::size_t i = 0; i < tokens.size(); ++i) {
            const std::string& tok = tokens[i];
            if (isOp(tok)) {
                long long b = st.top(); st.pop();
                long long a = st.top(); st.pop();
                long long c = 0;
                switch (tok[0]) {
                    case '+': c = a + b; break;
                    case '-': c = a - b; break;
                    case '*': c = a * b; break;
                    case '/': 
                        // truncation toward zero is default for integer division in C++
                        c = a / b; 
                        break;
                }
                st.push(c);
            } else {
                st.push(std::stoll(tok));
            }
        }
        return static_cast<int>(st.top());
    }
private:
    static bool isOp(const std::string& s) {
        return s.size() == 1 && (s[0] == '+' || s[0] == '-' || s[0] == '*' || s[0] == '/');
    }
};

/*
Approach:
- Use a stack of 64-bit integers. Scan tokens; if number push parsed value; if operator, pop two operands (a then b), compute a op b, push result. 
- Division truncates toward zero in C++, matching problem requirement.

Complexity:
- Time: O(n)
- Space: O(n)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    std::vector<std::string> t1 = {"2","1","+","3","*"}; // (2+1)*3 = 9
    std::cout << sol.evalRPN(t1) << "\n"; // 9
    std::vector<std::string> t2 = {"4","13","5","/","+"}; // 4 + 13/5 = 6
    std::cout << sol.evalRPN(t2) << "\n"; // 6
    std::vector<std::string> t3 = {"10","6","9","3","+","-11","*","/","*","17","+","5","+"};
    // result = 22
    std::cout << sol.evalRPN(t3) << "\n"; // 22
    return 0;
}
#endif