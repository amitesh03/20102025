/*
LeetCode 399. Evaluate Division
Link: https://leetcode.com/problems/evaluate-division/

Question:
You are given an array of variable equations and real values, where equations[i] = [Ai, Bi] and values[i] = v,
represent the equation Ai / Bi = v. Queries are represented by pairs [Xj, Yj]; return the result of Xj / Yj.
If the answer does not exist, return -1.0.

Constraints:
- 1 <= equations.length, values.length <= 20
- 1 <= queries.length <= 20
- Ai, Bi, Xj, Yj are strings consisting of lower-case letters

Approach (Graph + BFS/DFS over multiplicative edges):
- Build a bidirectional weighted graph: edge A->B with weight v, and B->A with weight 1/v.
- For each query X/Y, BFS from X accumulating the product; when reaching Y, answer is the product.
- If either variable not seen or Y unreachable, answer -1.0.

Complexity:
- Time: O(E + V) per query in worst case; overall O((E+V)*Q) for BFS approach with small constraints
- Space: O(E + V)
*/

#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <queue>

class Solution {
public:
    std::vector<double> calcEquation(const std::vector<std::vector<std::string>>& equations,
                                     const std::vector<double>& values,
                                     const std::vector<std::vector<std::string>>& queries) {
        std::unordered_map<std::string, std::vector<std::pair<std::string, double>>> g;
        g.reserve(equations.size() * 2 + 4);
        for (size_t i = 0; i < equations.size(); ++i) {
            const std::string& A = equations[i][0];
            const std::string& B = equations[i][1];
            double v = values[i];
            g[A].push_back({B, v});
            g[B].push_back({A, 1.0 / v});
        }

        std::vector<double> ans;
        ans.reserve(queries.size());
        for (size_t qi = 0; qi < queries.size(); ++qi) {
            const std::string& X = queries[qi][0];
            const std::string& Y = queries[qi][1];
            if (g.find(X) == g.end() || g.find(Y) == g.end()) {
                ans.push_back(-1.0);
                continue;
            }
            if (X == Y) {
                ans.push_back(1.0);
                continue;
            }
            std::queue<std::pair<std::string, double>> q;
            std::unordered_set<std::string> vis;
            q.push({X, 1.0});
            vis.insert(X);
            double found = -1.0;
            while (!q.empty()) {
                auto cur = q.front(); q.pop();
                const std::string& u = cur.first;
                double val = cur.second;
                if (u == Y) { found = val; break; }
                const std::vector<std::pair<std::string, double>>& nbrs = g[u];
                for (size_t i = 0; i < nbrs.size(); ++i) {
                    const std::string& vName = nbrs[i].first;
                    double w = nbrs[i].second;
                    if (vis.find(vName) == vis.end()) {
                        vis.insert(vName);
                        q.push({vName, val * w});
                    }
                }
            }
            ans.push_back(found);
        }
        return ans;
    }
};