/*
LeetCode 997. Find the Town Judge
Link: https://leetcode.com/problems/find-the-town-judge/

Question:
In a town of n people labeled from 1 to n, each person has trust relationships trust[i] = [a, b]
meaning the person labeled a trusts the person labeled b. The town judge is the person that
everyone (except the judge) trusts, and the judge trusts nobody. Return the label of the town
judge if it exists, and -1 otherwise.

Constraints:
- 1 <= n <= 1000
- 0 <= trust.length <= 10^4
- trust[i].length == 2
- All trust pairs are valid labels in [1..n]

Approach (In-degree / Out-degree):
- For each edge a->b: outdeg[a]++, indeg[b]++.
- Judge must have indeg == n-1 and outdeg == 0.
- Edge case: if n == 1 and trust is empty, judge is 1.

Complexity:
- Time: O(n + m) where m = trust.size()
- Space: O(n)
*/

#include <vector>

class Solution {
public:
    int findJudge(int n, std::vector<std::vector<int>>& trust) {
        if (n == 1 && trust.empty()) return 1;
        std::vector<int> indeg(n + 1, 0);
        std::vector<int> outdeg(n + 1, 0);
        for (size_t i = 0; i < trust.size(); ++i) {
            int a = trust[i][0];
            int b = trust[i][1];
            if (a >= 1 && a <= n) ++outdeg[a];
            if (b >= 1 && b <= n) ++indeg[b];
        }
        for (int i = 1; i <= n; ++i) {
            if (indeg[i] == n - 1 && outdeg[i] == 0) return i;
        }
        return -1;
    }
};