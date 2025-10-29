/*
LeetCode 990. Satisfiability of Equality Equations
Link: https://leetcode.com/problems/satisfiability-of-equality-equations/

Question:
Given an array of strings equations that represent relationships between variables 'a' to 'z',
each equation is either "x==y" or "x!=y". Determine if it is possible to assign integers to variable
names so as to satisfy all the given equations.

Constraints:
- 1 <= equations.length <= 500
- equations[i].length == 4
- equations[i][0] is a lowercase letter
- equations[i][1] is either '=' or '!'
- equations[i][2] is '='
- equations[i][3] is a lowercase letter

Approach (Union-Find over 26 variables):
- Use DSU on the fixed set {0..25} representing 'a'..'z'.
- First pass: union(x, y) for all "x==y" constraints.
- Second pass: verify all "x!=y" constraints by checking that find(x) != find(y).
- If any inequality has both variables in the same component, return false; otherwise true.

Complexity:
- Time: O(26 α(26) + n) ~ O(n)
- Space: O(1) extra (arrays of size 26)
*/

#include <string>
#include <vector>

class Solution {
    int parent[26];
    int rankv[26];

    int findp(int x) {
        // Path compression
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    void unite(int a, int b) {
        a = findp(a);
        b = findp(b);
        if (a == b) return;
        if (rankv[a] < rankv[b]) {
            parent[a] = b;
        } else if (rankv[a] > rankv[b]) {
            parent[b] = a;
        } else {
            parent[b] = a;
            ++rankv[a];
        }
    }

public:
    bool equationsPossible(std::vector<std::string>& equations) {
        // init DSU
        for (int i = 0; i < 26; ++i) {
            parent[i] = i;
            rankv[i] = 0;
        }

        // First pass: process equalities
        for (size_t i = 0; i < equations.size(); ++i) {
            const std::string& e = equations[i];
            if (e[1] == '=' && e[2] == '=') {
                int x = e[0] - 'a';
                int y = e[3] - 'a';
                unite(x, y);
            }
        }

        // Second pass: check inequalities
        for (size_t i = 0; i < equations.size(); ++i) {
            const std::string& e = equations[i];
            if (e[1] == '!' && e[2] == '=') {
                int x = e[0] - 'a';
                int y = e[3] - 'a';
                if (findp(x) == findp(y)) return false;
            }
        }

        return true;
    }
};