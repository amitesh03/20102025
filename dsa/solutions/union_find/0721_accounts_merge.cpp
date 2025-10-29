/*
LeetCode 721. Accounts Merge
Link: https://leetcode.com/problems/accounts-merge/

Question:
Given a list of accounts where each account is represented as [name, email1, email2, ...],
merge accounts that belong to the same person. Two accounts belong to the same person
if there is any common email. Return the merged accounts where each account is in the form
[name, sorted_unique_emails...]. The emails must be sorted lexicographically.

Constraints:
- 1 <= accounts.length <= 1000
- 2 <= accounts[i].length <= 10
- 1 <= accounts[i][j].length <= 30
- accounts[i][j] consists of lowercase English letters and the characters '@' and '.'.
*/

#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <cstddef>

class Solution {
private:
    std::vector<int> parent;
    std::vector<int> rnk;

    int findp(int x) {
        if (parent[x] != x) parent[x] = findp(parent[x]);
        return parent[x];
    }

    void unite(int a, int b) {
        int pa = findp(a), pb = findp(b);
        if (pa == pb) return;
        if (rnk[pa] < rnk[pb]) {
            parent[pa] = pb;
        } else if (rnk[pa] > rnk[pb]) {
            parent[pb] = pa;
        } else {
            parent[pb] = pa;
            ++rnk[pa];
        }
    }

public:
    std::vector<std::vector<std::string>> accountsMerge(std::vector<std::vector<std::string>>& accounts) {
        // Map each email to a unique id; also keep a mapping email -> name
        std::unordered_map<std::string, int> emailId;
        std::unordered_map<std::string, std::string> emailName;

        int idCounter = 0;
        for (std::size_t i = 0; i < accounts.size(); ++i) {
            const std::vector<std::string>& acc = accounts[i];
            if (acc.size() <= 1) continue;
            const std::string& name = acc[0];
            // For this account, assign ids to emails and union them together
            int firstId = -1;
            for (std::size_t j = 1; j < acc.size(); ++j) {
                const std::string& email = acc[j];
                auto it = emailId.find(email);
                if (it == emailId.end()) {
                    emailId[email] = idCounter++;
                    emailName[email] = name;
                }
                int curId = emailId[email];
                if (firstId == -1) firstId = curId;
                // ensure DSU arrays are large enough
                if (static_cast<int>(parent.size()) < idCounter) {
                    parent.resize(idCounter);
                    rnk.resize(idCounter);
                    // initialize newly added node
                    parent[curId] = curId;
                    rnk[curId] = 0;
                    if (firstId != curId) {
                        // also ensure firstId is initialized if it was added earlier in this loop
                        parent[firstId] = firstId;
                    }
                }
                // union with first email of this account
                unite(firstId, curId);
            }
        }

        // Group emails by DSU root
        std::unordered_map<int, std::vector<std::string>> groups;
        groups.reserve(emailId.size());
        for (auto it = emailId.begin(); it != emailId.end(); ++it) {
            const std::string& email = it->first;
            int idx = it->second;
            int root = findp(idx);
            groups[root].push_back(email);
        }

        // Build result: sort emails in each group and prepend name (use name of any email in group)
        std::vector<std::vector<std::string>> result;
        result.reserve(groups.size());
        for (auto it = groups.begin(); it != groups.end(); ++it) {
            std::vector<std::string>& emails = it->second;
            std::sort(emails.begin(), emails.end());
            // name can be looked up via the first email
            const std::string& name = emailName[emails[0]];
            std::vector<std::string> merged;
            merged.reserve(emails.size() + 1);
            merged.push_back(name);
            for (std::size_t k = 0; k < emails.size(); ++k) {
                merged.push_back(emails[k]);
            }
            result.push_back(merged);
        }
        return result;
    }
};

/*
Approach:
- Assign a unique id to each email and store email -> name mapping.
- For each account, union the ids of all its emails (they belong to the same person).
- After unions, group emails by root parent; sort emails in each group and prepend the name.

Complexity:
- Time: O(N * M * α(U) + U log U) where:
    N = accounts.size(), M = average emails per account,
    U = number of unique emails, α is inverse Ackermann.
- Space: O(U) for DSU and maps.
*/

#ifdef LOCAL_TEST
#include <iostream>
int main() {
    Solution sol;
    std::vector<std::vector<std::string>> accounts = {
        {"John","johnsmith@mail.com","john_newyork@mail.com"},
        {"John","johnsmith@mail.com","john00@mail.com"},
        {"Mary","mary@mail.com"},
        {"John","johnnybravo@mail.com"}
    };
    auto res = sol.accountsMerge(accounts);
    for (std::size_t i = 0; i < res.size(); ++i) {
        for (std::size_t j = 0; j < res[i].size(); ++j) {
            if (j) std::cout << " ";
            std::cout << res[i][j];
        }
        std::cout << "\n";
    }
    return 0;
}
#endif