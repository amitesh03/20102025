/*
LeetCode 8. String to Integer (atoi)
Link: https://leetcode.com/problems/string-to-integer-atoi/

Question:
Implement atoi which converts a string to an integer.
Read in and ignore leading whitespace.
Check for optional sign.
Read digits until non-digit encountered.
If value overflows 32-bit signed int, clamp to INT_MAX=2147483647 or INT_MIN=-2147483648.

Constraints:
- 0 <= s.length <= 200
- s may contain whitespaces and characters.
*/

#include <iostream>
#include <string>
#include <climits>
using namespace std;

class Solution {
public:
    int myAtoi(string s) {
        int i=0, n = static_cast<int>(s.size());
        while (i<n && s[i]==' ') ++i;
        int sign = 1;
        if (i<n && (s[i]=='+' || s[i]=='-')) { sign = (s[i]=='-') ? -1 : 1; ++i; }
        long long val = 0;
        while (i<n && s[i]>='0' && s[i]<='9') {
            int d = s[i]-'0';
            val = val*10 + d;
            long long cand = val * sign;
            if (cand > INT_MAX) return INT_MAX;
            if (cand < INT_MIN) return INT_MIN;
            ++i;
        }
        return static_cast<int>(val * sign);
    }
};

/*
Approach:
- Skip leading spaces, parse sign, accumulate digits as long long, clamp on overflow.

Complexity:
- Time: O(n)
- Space: O(1)
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    cout << sol.myAtoi("42") << "\n";          // 42
    cout << sol.myAtoi("   -42") << "\n";      // -42
    cout << sol.myAtoi("4193 with words") << "\n"; // 4193
    cout << sol.myAtoi("words and 987") << "\n";   // 0
    cout << sol.myAtoi("-91283472332") << "\n";    // -2147483648
    return 0;
}
#endif