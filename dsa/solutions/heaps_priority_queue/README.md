# Heaps / Priority Queue (Alias) — Practice Overview

Scope:
- Concepts: top-k selection, min/max heap, multiway merge, scheduling
- Language: C++ STL (priority_queue, vector, custom comparators)
- Each solution file includes the problem statement at the top in comments and uses idiomatic STL.

Syllabus source: [syllabus/syllabus.md](../../syllabus/syllabus.md)

## About This Folder

- This folder serves as an alias and organizational pointer for heap-based problems.
- All implementations are consolidated under:
  - Heaps: [solutions/heaps/README.md](../heaps/README.md)
  - K-way Merge: [solutions/k_way_merge/README.md](../k_way_merge/README.md)

## Problems and Status (See linked folders)

- Heaps selection and scheduling:
  - 215, 347, 295, 23, 502, 621, 373
- K-way merge patterns:
  - 632

## Notes

- Prefer using priority_queue with appropriate comparator for min/max behavior.
- For completeness and reduced duplication, new heap-related problems should be placed under [solutions/heaps/](../heaps) or [solutions/k_way_merge/](../k_way_merge).