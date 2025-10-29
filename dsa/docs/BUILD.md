# C++ Build and VSCode Configuration Guide

Purpose:
- Standardize local compilation for all solution files in this repository
- Provide instructions to run Local Test blocks guarded by `#ifdef LOCAL_TEST`
- Address common VSCode IntelliSense false errors (e.g., “std::vector has no member size/begin/end”, “no operator []”)

Repository structure overview:
- Core topics: see per-topic READMEs, e.g. [solutions/arrays/README.md](../solutions/arrays/README.md), [solutions/strings/README.md](../solutions/strings/README.md), [solutions/hash_map_set/README.md](../solutions/hash_map_set/README.md), [solutions/linked_list/README.md](../solutions/linked_list/README.md), [solutions/stack_queue/README.md](../solutions/stack_queue/README.md), [solutions/trees/README.md](../solutions/trees/README.md), [solutions/bst/README.md](../solutions/bst/README.md), [solutions/heaps/README.md](../solutions/heaps/README.md), [solutions/trie/README.md](../solutions/trie/README.md), [solutions/graphs/README.md](../solutions/graphs/README.md), [solutions/union_find/README.md](../solutions/union_find/README.md), [solutions/string_algorithms/README.md](../solutions/string_algorithms/README.md)
- Algorithmic patterns: see per-pattern directories, e.g. [patterns/sliding_window](../patterns/sliding_window), [patterns/two_pointers](../patterns/two_pointers)

## 1) Compile any solution file (Windows, g++ from MinGW or MSYS2)

Prerequisites:
- Install MSYS2 (recommended) or MinGW-w64
- Ensure g++ is available in PATH

Compile commands:
- Basic compile (C++17, optimizations):
  - `g++ -std=c++17 -O2 -pipe -static -s -DNDEBUG path/to/file.cpp -o a.exe`
- Enable local tests (for files that include a `main()` block under LOCAL_TEST):
  - `g++ -std=c++17 -O2 -pipe -static -s -DNDEBUG -DLOCAL_TEST path/to/file.cpp -o a.exe`

Run:
- `.\a.exe`

Examples:
- Compile Sliding Window 76:
  - `g++ -std=c++17 -O2 -DLOCAL_TEST patterns\\sliding_window\\0076_minimum_window_substring.cpp -o win76.exe`
- Compile Two Pointers 88:
  - `g++ -std=c++17 -O2 -DLOCAL_TEST patterns\\two_pointers\\0088_merge_sorted_array.cpp -o m88.exe`

Note:
- LeetCode-style class signatures are preserved (e.g., [Solution.minWindow()](../patterns/sliding_window/0076_minimum_window_substring.cpp:30), [Solution.merge()](../patterns/two_pointers/0088_merge_sorted_array.cpp:31), [Solution.twoSum()](../patterns/two_pointers/0167_two_sum_ii_input_array_is_sorted.cpp:32)). For local testing, files may include test harnesses under `#ifdef LOCAL_TEST`.

## 2) Fixing VSCode IntelliSense false errors

Symptoms you may see:
- “std::vector has no member size/begin/end”
- “no operator [] matches these operands”
- “namespace std has no member isalnum/tolower”
- “std::vector does not have push_back”

These typically indicate IntelliSense (the C/C++ extension’s parser) is not using the correct compiler/standard library configuration.

Recommended configuration steps:
1) Install the Microsoft C/C++ extension (ms-vscode.cpptools).
2) Open Command Palette → “C/C++: Edit Configurations (UI)”
3) Ensure:
   - Compiler path points to your g++ (e.g., `C:\\msys64\\mingw64\\bin\\g++.exe` or your MinGW-w64 path)
   - C standard: `c17`
   - C++ standard: `c++17`
   - IntelliSense mode: `windows-gcc-x64`
4) If the UI is not sufficient, edit `.vscode/c_cpp_properties.json` and set:
   - `"compilerPath": "C:\\msys64\\mingw64\\bin\\g++.exe"`
   - `"cStandard": "c17"`
   - `"cppStandard": "c++17"`
   - `"intelliSenseMode": "windows-gcc-x64"`
   - Add proper include paths if needed: `"includePath": ["C:\\msys64\\mingw64\\include", "C:\\msys64\\mingw64\\lib\\gcc\\x86_64-w64-mingw32\\<version>\\include"]`

Optional:
- Provide a `compile_commands.json` and set `"configurationProvider": "ms-vscode.cpptools"` to have IntelliSense follow your actual build commands.

## 3) Notes on STL usage and local testing

- All solutions use C++ STL idioms (e.g., `std::vector`, `std::string`, `std::unordered_map`, `std::priority_queue`) and standard algorithms (e.g., `std::sort`).
- Where helpful, fixed-size arrays are used for ASCII frequency tables in sliding window problems to minimize overhead.
- For certain string utilities, files may include lightweight helpers instead of `<cctype>` if your environment misconfigures libc headers, e.g., see [Solution.isPalindrome() helpers](../patterns/two_pointers/0125_valid_palindrome.cpp:33).

## 4) Troubleshooting checklist

- If compilation fails but IntelliSense reports errors:
  - Try compiling with g++ as above; if compilation succeeds, treat IntelliSense warnings as non-blocking.
- If g++ compilation fails with missing headers:
  - Verify your toolchain installation and include paths (MSYS2/MinGW-w64).
- If Windows Defender blocks execution:
  - Unblock the `.exe` via file properties or use PowerShell: `Unblock-File .\a.exe`.

## 5) Directory quick links

- Arrays: [solutions/arrays/README.md](../solutions/arrays/README.md)
- Strings: [solutions/strings/README.md](../solutions/strings/README.md)
- Hash Map / Set: [solutions/hash_map_set/README.md](../solutions/hash_map_set/README.md)
- Linked List: [solutions/linked_list/README.md](../solutions/linked_list/README.md)
- Stack & Queue: [solutions/stack_queue/README.md](../solutions/stack_queue/README.md)
- Trees: [solutions/trees/README.md](../solutions/trees/README.md)
- BST: [solutions/bst/README.md](../solutions/bst/README.md)
- Heaps: [solutions/heaps/README.md](../solutions/heaps/README.md)
- Trie: [solutions/trie/README.md](../solutions/trie/README.md)
- Graphs: [solutions/graphs/README.md](../solutions/graphs/README.md)
- Union-Find: [solutions/union_find/README.md](../solutions/union_find/README.md)
- String Algorithms: [solutions/string_algorithms/README.md](../solutions/string_algorithms/README.md)
- Patterns (Sliding Window): [patterns/sliding_window](../patterns/sliding_window)
- Patterns (Two Pointers): [patterns/two_pointers](../patterns/two_pointers)
