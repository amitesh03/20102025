/*
LeetCode 49. Group Anagrams
Link: https://leetcode.com/problems/group-anagrams/

Question:
Given an array of strings strs, group the anagrams together. You can return the answer in any order.

Constraints:
- 1 <= strs.length <= 10^4
- 0 <= strs[i].length <= 100
- strs[i] consists of lowercase English letters.
*/

#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        groups.reserve(strs.size());
        for (const string& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            groups[key].push_back(s);
        }
        vector<vector<string>> res;
        res.reserve(groups.size());
        for (auto& kv : groups) {
            res.push_back(move(kv.second));
        }
        return res;
    }
};

/*
Approach:
- Use the sorted string as a canonical key; strings with the same key are anagrams and grouped together.

Complexity:
- Time: O(N * K log K), where N is number of strings and K is average string length
- Space: O(N * K) for storing groups
*/

#ifdef LOCAL_TEST
int main() {
    Solution sol;
    vector<string> strs = {"eat","tea","tan","ate","nat","bat"};
    auto ans = sol.groupAnagrams(strs);
    for (auto& g : ans) {
        cout << "[";
        for (size_t i = 0; i < g.size(); ++i) {
            if (i) cout << ",";
            cout << g[i];
        }
        cout << "]\n";
    }
    return 0;
}
#endif