import "dotenv/config";
import mongoose from "mongoose";
import Subject from "../models/Subject.js";

const seedData = [
  // ─── 1. DSA ───────────────────────────────────────────────────
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    icon: "🧠",
    color: "#6366f1",
    colorBg: "rgba(99,102,241,0.12)",
    category: "core",
    badge: "HOT",
    description: "Arrays, Trees, Graphs, Sorting, DP — the backbone of CS interviews.",
    tags: ["Arrays", "Trees", "Graphs", "DP", "Sorting"],
    questions: [
      { question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correct: 1, explanation: "Binary search halves the search space each step.", topic: "Searching", difficulty: "Easy" },
      { question: "Which data structure uses LIFO order?", options: ["Queue", "Stack", "Linked List", "Tree"], correct: 1, explanation: "A Stack follows LIFO — last in, first out.", topic: "Stack & Queue", difficulty: "Easy" },
      { question: "What is the worst-case time complexity of QuickSort?", options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], correct: 1, explanation: "QuickSort degrades to O(n²) with bad pivot selection.", topic: "Sorting", difficulty: "Medium" },
      { question: "Which traversal visits nodes Left → Root → Right?", options: ["Preorder", "Postorder", "Inorder", "Level order"], correct: 2, explanation: "Inorder traversal visits nodes in sorted order for a BST.", topic: "Trees", difficulty: "Easy" },
      { question: "What is the space complexity of Merge Sort?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correct: 2, explanation: "Merge Sort requires O(n) auxiliary space.", topic: "Sorting", difficulty: "Medium" },
      { question: "In which data structure do insertions and deletions happen at both ends?", options: ["Stack", "Queue", "Deque", "Array"], correct: 2, explanation: "A Deque (Double-Ended Queue) allows insertion/deletion at both ends.", topic: "Stack & Queue", difficulty: "Easy" },
      { question: "What is the height of a complete binary tree with n nodes?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1, explanation: "A complete binary tree has height ⌊log₂n⌋.", topic: "Trees", difficulty: "Medium" },
      { question: "Which algorithm finds the shortest path in an unweighted graph?", options: ["Dijkstra", "BFS", "DFS", "Bellman-Ford"], correct: 1, explanation: "BFS guarantees the shortest path (fewest edges) in an unweighted graph.", topic: "Graphs", difficulty: "Medium" },
      { question: "What is the Bellman-Ford algorithm used for?", options: ["Shortest path without negative edges", "Shortest path with negative edges", "MST", "Cycle detection"], correct: 1, explanation: "Bellman-Ford handles negative edge weights and detects negative cycles.", topic: "Graphs", difficulty: "Hard" },
      { question: "Which of the following is NOT a stable sorting algorithm?", options: ["Merge Sort", "Insertion Sort", "Quick Sort", "Bubble Sort"], correct: 2, explanation: "QuickSort is not stable — equal elements may be reordered.", topic: "Sorting", difficulty: "Medium" },
      { question: "What is dynamic programming?", options: ["Solving problems by trying all combinations", "Solving problems by breaking into overlapping subproblems", "A type of recursion only", "A graph traversal technique"], correct: 1, explanation: "DP solves problems by storing solutions to overlapping subproblems to avoid recomputation.", topic: "Dynamic Programming", difficulty: "Medium" },
      { question: "What is the time complexity of Heap Sort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correct: 1, explanation: "Heap Sort runs in O(n log n) in all cases.", topic: "Sorting", difficulty: "Medium" },
    ],
  },

  // ─── 2. OS ────────────────────────────────────────────────────
  {
    id: "os",
    name: "Operating Systems",
    icon: "💻",
    color: "#10b981",
    colorBg: "rgba(16,185,129,0.12)",
    category: "systems",
    badge: "TOP",
    description: "Processes, scheduling, memory management, deadlocks, and file systems.",
    tags: ["Processes", "Memory", "Deadlocks", "Scheduling", "File Systems"],
    questions: [
      { question: "What is a process?", options: ["A program in execution", "A file on disk", "A CPU register", "A memory block"], correct: 0, explanation: "A process is a program loaded into memory and currently executing.", topic: "Processes", difficulty: "Easy" },
      { question: "Which scheduling algorithm can cause starvation?", options: ["Round Robin", "FCFS", "Priority Scheduling", "SRTF"], correct: 2, explanation: "Priority Scheduling can starve low-priority processes.", topic: "Scheduling", difficulty: "Medium" },
      { question: "What is a deadlock?", options: ["A type of CPU burst", "A condition where processes wait indefinitely", "A memory leak", "A page fault"], correct: 1, explanation: "Deadlock: processes hold resources and wait for resources held by others.", topic: "Deadlocks", difficulty: "Easy" },
      { question: "Which of Coffman's conditions is NOT required for deadlock?", options: ["Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait"], correct: 2, explanation: "Non-preemption (not preemption) is required.", topic: "Deadlocks", difficulty: "Hard" },
      { question: "What does LRU stand for in page replacement?", options: ["Last Recently Used", "Least Recently Used", "Least Relevant Unit", "Last Run Unit"], correct: 1, explanation: "LRU replaces the page not accessed for the longest time.", topic: "Memory Management", difficulty: "Easy" },
      { question: "What is thrashing?", options: ["Excessive CPU usage", "Excessive paging causing low CPU utilization", "Disk corruption", "Memory overflow"], correct: 1, explanation: "Thrashing: a process spends more time paging than executing.", topic: "Memory Management", difficulty: "Medium" },
      { question: "Which is a non-preemptive scheduling algorithm?", options: ["Round Robin", "SRTF", "FCFS", "Multilevel Queue"], correct: 2, explanation: "FCFS is non-preemptive — a process runs until it finishes.", topic: "Scheduling", difficulty: "Easy" },
      { question: "What is the purpose of the PCB?", options: ["Store process state and info", "Control printer", "Manage files", "Handle interrupts"], correct: 0, explanation: "PCB stores all info about a process: state, PID, registers, memory maps.", topic: "Processes", difficulty: "Easy" },
      { question: "What is virtual memory?", options: ["Extra RAM", "A technique to use disk as extended RAM", "Cache memory", "ROM"], correct: 1, explanation: "Virtual memory lets processes use more memory than physically available.", topic: "Memory Management", difficulty: "Medium" },
      { question: "Which page replacement algorithm is theoretically optimal?", options: ["LRU", "FIFO", "Optimal (OPT)", "Clock"], correct: 2, explanation: "Optimal replaces the page not needed for the longest time — but requires future knowledge.", topic: "Memory Management", difficulty: "Hard" },
      { question: "What is a semaphore?", options: ["A CPU instruction", "A synchronization tool using integer variables", "A memory address", "A file descriptor"], correct: 1, explanation: "A semaphore is used for process synchronization and mutual exclusion.", topic: "Synchronization", difficulty: "Medium" },
      { question: "What is the difference between a process and a thread?", options: ["No difference", "Threads share memory; processes don't", "Processes share memory; threads don't", "Threads run on separate CPUs only"], correct: 1, explanation: "Threads within a process share code, data, and heap; processes have separate memory spaces.", topic: "Processes", difficulty: "Medium" },
    ],
  },

  // ─── 3. DBMS ──────────────────────────────────────────────────
  {
    id: "dbms",
    name: "Database Management",
    icon: "🗄️",
    color: "#f59e0b",
    colorBg: "rgba(245,158,11,0.12)",
    category: "core",
    badge: "HOT",
    description: "SQL, normalization, transactions, indexing, and query optimization.",
    tags: ["SQL", "Normalization", "Transactions", "Indexing"],
    questions: [
      { question: "What does ACID stand for?", options: ["Atomicity, Consistency, Isolation, Durability", "Access, Control, Index, Data", "Async, Commit, Insert, Delete", "None of these"], correct: 0, explanation: "ACID properties ensure reliable database transactions.", topic: "Transactions", difficulty: "Easy" },
      { question: "Which normal form eliminates transitive dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], correct: 2, explanation: "3NF eliminates transitive functional dependencies.", topic: "Normalization", difficulty: "Medium" },
      { question: "What is an index in a database?", options: ["A backup copy", "A data structure to speed up queries", "A foreign key", "A view"], correct: 1, explanation: "Indexes improve query performance by allowing faster data lookup.", topic: "Indexing", difficulty: "Easy" },
      { question: "What is a foreign key?", options: ["A primary key in another table", "A key that references the primary key of another table", "A unique identifier", "A composite key"], correct: 1, explanation: "A foreign key is a column that references the primary key of another table, enforcing referential integrity.", topic: "SQL Basics", difficulty: "Easy" },
      { question: "What is a SQL JOIN?", options: ["A way to combine rows from two or more tables", "A type of index", "A backup strategy", "A stored procedure"], correct: 0, explanation: "JOIN combines rows from multiple tables based on a related column.", topic: "SQL Basics", difficulty: "Easy" },
      { question: "What is the difference between DELETE and TRUNCATE?", options: ["No difference", "TRUNCATE is faster and cannot be rolled back; DELETE can", "DELETE is faster", "TRUNCATE filters rows"], correct: 1, explanation: "TRUNCATE removes all rows without logging individual row deletions and is not easily reversible.", topic: "SQL Basics", difficulty: "Medium" },
      { question: "What is a View in SQL?", options: ["A permanent table", "A virtual table based on a query", "A stored procedure", "An index"], correct: 1, explanation: "A View is a virtual table defined by a SQL query.", topic: "SQL Basics", difficulty: "Medium" },
      { question: "What is the 2NF requirement?", options: ["No multivalued dependencies", "No partial dependencies on composite primary key", "No transitive dependencies", "All values must be atomic"], correct: 1, explanation: "2NF requires the table be in 1NF and have no partial dependencies on composite primary keys.", topic: "Normalization", difficulty: "Hard" },
      { question: "What does GROUP BY do in SQL?", options: ["Sorts rows", "Groups rows with same values for aggregation", "Joins tables", "Filters columns"], correct: 1, explanation: "GROUP BY groups rows sharing a property so aggregate functions can be applied.", topic: "SQL Basics", difficulty: "Easy" },
      { question: "What is a B-Tree index?", options: ["A binary search tree", "A balanced tree used by databases for indexing", "A hash table", "A sorted array"], correct: 1, explanation: "B-Tree indexes keep data sorted and allow efficient search, insert, and delete.", topic: "Indexing", difficulty: "Hard" },
    ],
  },

  // ─── 4. Computer Networks ─────────────────────────────────────
  {
    id: "networks",
    name: "Computer Networks",
    icon: "🌐",
    color: "#3b82f6",
    colorBg: "rgba(59,130,246,0.12)",
    category: "systems",
    badge: "NEW",
    description: "OSI model, TCP/IP, routing, protocols, and network security.",
    tags: ["OSI Model", "TCP/IP", "Routing", "DNS", "HTTP"],
    questions: [
      { question: "How many layers does the OSI model have?", options: ["4", "5", "7", "8"], correct: 2, explanation: "The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.", topic: "OSI Model", difficulty: "Easy" },
      { question: "Which layer is responsible for routing in the OSI model?", options: ["Transport", "Data Link", "Network", "Session"], correct: 2, explanation: "The Network layer (Layer 3) handles routing of packets between networks.", topic: "OSI Model", difficulty: "Easy" },
      { question: "What does TCP stand for?", options: ["Transfer Control Protocol", "Transmission Control Protocol", "Transport Connection Protocol", "Transmission Connection Protocol"], correct: 1, explanation: "TCP - Transmission Control Protocol, provides reliable, ordered, error-checked delivery.", topic: "TCP/IP", difficulty: "Easy" },
      { question: "Which protocol is connectionless?", options: ["TCP", "FTP", "UDP", "HTTP"], correct: 2, explanation: "UDP (User Datagram Protocol) is connectionless — no handshake before sending data.", topic: "TCP/IP", difficulty: "Easy" },
      { question: "What is the purpose of DNS?", options: ["Assign IP addresses", "Translate domain names to IP addresses", "Encrypt traffic", "Route packets"], correct: 1, explanation: "DNS (Domain Name System) resolves human-readable domain names to IP addresses.", topic: "DNS", difficulty: "Easy" },
      { question: "What is a subnet mask used for?", options: ["Encryption", "Dividing a network into subnets", "Routing protocols", "Port assignment"], correct: 1, explanation: "A subnet mask determines which portion of an IP address belongs to the network vs the host.", topic: "IP Addressing", difficulty: "Medium" },
      { question: "Which port does HTTPS use by default?", options: ["80", "21", "443", "22"], correct: 2, explanation: "HTTPS uses port 443 by default.", topic: "Protocols", difficulty: "Easy" },
      { question: "What is the purpose of ARP?", options: ["Resolve IP to MAC address", "Assign IP addresses", "Encrypt network traffic", "Manage routing tables"], correct: 0, explanation: "ARP (Address Resolution Protocol) maps an IP address to a physical MAC address.", topic: "Protocols", difficulty: "Medium" },
      { question: "Which routing algorithm uses Dijkstra's algorithm internally?", options: ["RIP", "BGP", "OSPF", "EIGRP"], correct: 2, explanation: "OSPF (Open Shortest Path First) uses Dijkstra's SPF algorithm.", topic: "Routing", difficulty: "Hard" },
      { question: "What is a MAC address?", options: ["A software address", "A unique hardware identifier for a network interface", "A dynamic address assigned by DHCP", "A type of IP address"], correct: 1, explanation: "A MAC address is a unique 48-bit hardware identifier burned into a network interface card.", topic: "Data Link", difficulty: "Easy" },
      { question: "What is the three-way handshake in TCP?", options: ["SYN → ACK → FIN", "SYN → SYN-ACK → ACK", "ACK → SYN → ACK", "FIN → SYN → ACK"], correct: 1, explanation: "TCP establishes a connection with SYN, SYN-ACK, ACK before data transfer begins.", topic: "TCP/IP", difficulty: "Medium" },
    ],
  },

  // ─── 5. Computer Organization & Architecture ──────────────────
  {
    id: "coa",
    name: "Computer Organization & Architecture",
    icon: "⚙️",
    color: "#8b5cf6",
    colorBg: "rgba(139,92,246,0.12)",
    category: "systems",
    badge: "",
    description: "CPU design, memory hierarchy, instruction sets, pipelining, and caches.",
    tags: ["CPU", "Pipelining", "Cache", "Memory", "ISA"],
    questions: [
      { question: "What is pipelining in CPU design?", options: ["Running one instruction at a time", "Overlapping instruction execution stages", "A type of cache", "A memory management technique"], correct: 1, explanation: "Pipelining overlaps multiple instruction stages (fetch, decode, execute) to improve throughput.", topic: "Pipelining", difficulty: "Easy" },
      { question: "What is a cache miss?", options: ["CPU calculation error", "Requested data not found in cache", "An interrupt", "A TLB fault"], correct: 1, explanation: "A cache miss occurs when the processor looks for data in cache but doesn't find it, requiring main memory access.", topic: "Cache Memory", difficulty: "Easy" },
      { question: "What is the purpose of the Program Counter (PC)?", options: ["Count instructions executed", "Hold the address of the next instruction", "Store results", "Manage memory"], correct: 1, explanation: "The PC (Program Counter) holds the memory address of the next instruction to be executed.", topic: "CPU Design", difficulty: "Easy" },
      { question: "What is a data hazard in pipelining?", options: ["A security vulnerability", "An instruction depends on the result of a previous unfinished instruction", "A cache miss", "A memory access error"], correct: 1, explanation: "Data hazards occur when an instruction needs the result of a prior instruction not yet completed.", topic: "Pipelining", difficulty: "Medium" },
      { question: "Which memory is fastest?", options: ["DRAM", "SSD", "Hard Disk", "Register"], correct: 3, explanation: "Registers are the fastest memory — they're inside the CPU itself.", topic: "Memory Hierarchy", difficulty: "Easy" },
      { question: "What is the principle of locality?", options: ["Programs access a small set of data repeatedly", "All memory is accessed equally", "Data is stored randomly", "Cache is always faster"], correct: 0, explanation: "Locality: programs tend to reuse recently accessed (temporal) or nearby (spatial) data.", topic: "Cache Memory", difficulty: "Medium" },
      { question: "What is RISC?", options: ["Reduced Instruction Set Computer", "Random Instruction Set Computing", "Rapid Instruction Scheduler Circuit", "Register-based Instruction Storage Core"], correct: 0, explanation: "RISC architectures use a small, highly optimized set of instructions for efficiency.", topic: "ISA", difficulty: "Easy" },
      { question: "What is DMA (Direct Memory Access)?", options: ["CPU directly reading from disk", "A way for hardware to access memory without CPU intervention", "A memory compression technique", "A cache strategy"], correct: 1, explanation: "DMA allows peripherals to transfer data directly to/from memory without involving the CPU.", topic: "I/O", difficulty: "Medium" },
      { question: "How many stages does a classic RISC pipeline have?", options: ["3", "4", "5", "8"], correct: 2, explanation: "The classic 5-stage RISC pipeline: IF, ID, EX, MEM, WB.", topic: "Pipelining", difficulty: "Medium" },
      { question: "What is Write-back cache policy?", options: ["Data always written to both cache and memory", "Data written to cache only, memory updated later", "Data written to memory only", "Cache is never written to"], correct: 1, explanation: "Write-back updates cache immediately but writes to memory only when the cache line is evicted.", topic: "Cache Memory", difficulty: "Hard" },
    ],
  },

  // ─── 6. Theory of Computation ─────────────────────────────────
  {
    id: "toc",
    name: "Theory of Computation",
    icon: "🔬",
    color: "#ec4899",
    colorBg: "rgba(236,72,153,0.12)",
    category: "theory",
    badge: "",
    description: "Automata, formal languages, Turing machines, and computational complexity.",
    tags: ["Automata", "Grammars", "Turing Machines", "Complexity", "NP"],
    questions: [
      { question: "What does DFA stand for?", options: ["Deterministic Finite Automaton", "Dynamic Finite Algorithm", "Discrete Function Array", "Dual Finite Automata"], correct: 0, explanation: "A DFA is a Deterministic Finite Automaton — a finite state machine with exactly one transition per symbol.", topic: "Automata", difficulty: "Easy" },
      { question: "Which type of grammar generates regular languages?", options: ["Context-Free Grammar", "Context-Sensitive Grammar", "Regular Grammar", "Unrestricted Grammar"], correct: 2, explanation: "Regular grammars (Type 3) generate regular languages accepted by finite automata.", topic: "Formal Languages", difficulty: "Medium" },
      { question: "What is the language of a DFA?", options: ["The set of all strings it rejects", "The set of all strings it accepts", "The alphabet it uses", "The set of its states"], correct: 1, explanation: "The language of a DFA is the set of all strings accepted by that DFA.", topic: "Automata", difficulty: "Easy" },
      { question: "Which problem is undecidable?", options: ["Whether a DFA accepts a string", "Whether a CFG is ambiguous", "Whether a DFA is equivalent to another DFA", "Whether a regular language is empty"], correct: 1, explanation: "The ambiguity problem for CFGs is undecidable.", topic: "Decidability", difficulty: "Hard" },
      { question: "What is the Pumping Lemma used for?", options: ["Proving a language is regular", "Proving a language is not regular", "Constructing a DFA", "Minimizing a DFA"], correct: 1, explanation: "The Pumping Lemma is used to prove that certain languages are NOT regular.", topic: "Formal Languages", difficulty: "Medium" },
      { question: "A Turing machine can simulate:", options: ["Only DFAs", "Only PDAs", "Any computable algorithm", "Context-free languages only"], correct: 2, explanation: "Turing machines are universal models of computation — they can simulate any algorithm.", topic: "Turing Machines", difficulty: "Medium" },
      { question: "What is the P vs NP problem?", options: ["Whether polynomial-time problems equal non-deterministic polynomial-time problems", "Performance vs Network Performance", "A sorting comparison", "A graph theory problem"], correct: 0, explanation: "P vs NP asks whether every problem whose solution can be verified in polynomial time can also be solved in polynomial time.", topic: "Complexity", difficulty: "Hard" },
      { question: "Which is stronger: NFA or DFA?", options: ["DFA", "NFA", "They are equivalent in power", "Depends on the language"], correct: 2, explanation: "NFAs and DFAs are equivalent in expressive power — both recognize exactly the regular languages.", topic: "Automata", difficulty: "Medium" },
      { question: "What does PDA stand for?", options: ["Push-Down Automata", "Polynomial Decision Algorithm", "Parallel Disk Array", "Proper Data Automata"], correct: 0, explanation: "A PDA (Push-Down Automata) is a finite automaton with a stack, used to recognize context-free languages.", topic: "Automata", difficulty: "Easy" },
      { question: "Which language is NOT context-free?", options: ["a^n b^n", "Palindromes", "a^n b^n c^n", "Regular expressions"], correct: 2, explanation: "a^n b^n c^n is a classic context-sensitive language — not recognizable by any PDA.", topic: "Formal Languages", difficulty: "Hard" },
    ],
  },

  // ─── 7. Compiler Design ───────────────────────────────────────
  {
    id: "compiler",
    name: "Compiler Design",
    icon: "🔧",
    color: "#06b6d4",
    colorBg: "rgba(6,182,212,0.12)",
    category: "theory",
    badge: "",
    description: "Lexical analysis, parsing, syntax trees, semantic analysis, and code generation.",
    tags: ["Lexer", "Parser", "Syntax Trees", "Code Generation", "Optimization"],
    questions: [
      { question: "What is the first phase of compilation?", options: ["Parsing", "Semantic Analysis", "Lexical Analysis", "Code Generation"], correct: 2, explanation: "Lexical analysis (tokenization) is the first phase, converting source code into tokens.", topic: "Phases", difficulty: "Easy" },
      { question: "A token is:", options: ["A line of code", "A meaningful sequence of characters (e.g. identifier, keyword)", "A byte of memory", "A CPU instruction"], correct: 1, explanation: "Tokens are the smallest meaningful units: keywords, identifiers, literals, operators.", topic: "Lexical Analysis", difficulty: "Easy" },
      { question: "What does a parser do?", options: ["Tokenize code", "Check syntactic structure using grammar rules", "Allocate memory", "Optimize loops"], correct: 1, explanation: "A parser verifies that tokens form a valid syntactic structure per the language grammar.", topic: "Parsing", difficulty: "Easy" },
      { question: "What is an Abstract Syntax Tree (AST)?", options: ["A tree showing CPU instruction flow", "A tree representation of the syntactic structure of code", "A parse table", "A symbol table"], correct: 1, explanation: "An AST is a tree representation of the abstract syntactic structure of source code.", topic: "Syntax Trees", difficulty: "Medium" },
      { question: "What handles type-checking in a compiler?", options: ["Lexer", "Parser", "Semantic Analyzer", "Code Generator"], correct: 2, explanation: "The semantic analyzer performs type checking and other context-sensitive analysis.", topic: "Semantic Analysis", difficulty: "Medium" },
      { question: "What is a symbol table?", options: ["A CPU register", "A data structure mapping names to attributes", "A parse tree node", "An instruction format"], correct: 1, explanation: "A symbol table maps identifiers to their types, scopes, and memory locations.", topic: "Symbol Table", difficulty: "Medium" },
      { question: "Which grammar type does a top-down parser use?", options: ["LR", "LL", "LALR", "SLR"], correct: 1, explanation: "Top-down parsers use LL grammars, reading left-to-right and producing leftmost derivations.", topic: "Parsing", difficulty: "Medium" },
      { question: "What is peephole optimization?", options: ["Reducing loop iterations", "Examining a small window of instructions and replacing with efficient code", "Inlining functions", "Eliminating dead code"], correct: 1, explanation: "Peephole optimization examines a small 'window' of instructions and replaces them with faster equivalents.", topic: "Optimization", difficulty: "Hard" },
      { question: "What is left recursion in grammars?", options: ["A grammar rule that eventually reaches itself from the left", "Recursion in loops", "Recursive functions", "Left-to-right parsing"], correct: 0, explanation: "Left recursion: a non-terminal derives itself as the leftmost symbol, causing top-down parsers to loop infinitely.", topic: "Parsing", difficulty: "Hard" },
      { question: "Which technique is used to eliminate left recursion?", options: ["Left factoring", "Substituting the recursive rule appropriately", "Adding more tokens", "Using a stack"], correct: 1, explanation: "Left recursion is eliminated by rewriting the grammar rule to use right recursion.", topic: "Parsing", difficulty: "Hard" },
    ],
  },

  // ─── 8. Discrete Mathematics ──────────────────────────────────
  {
    id: "discrete-math",
    name: "Discrete Mathematics",
    icon: "📐",
    color: "#f97316",
    colorBg: "rgba(249,115,22,0.12)",
    category: "math",
    badge: "",
    description: "Logic, set theory, graph theory, combinatorics, probability.",
    tags: ["Logic", "Sets", "Graphs", "Combinatorics", "Proofs"],
    questions: [
      { question: "What is a tautology?", options: ["A statement always false", "A statement always true", "An undefined statement", "A conditional statement"], correct: 1, explanation: "A tautology is a logical statement that is true under all possible interpretations.", topic: "Logic", difficulty: "Easy" },
      { question: "What is the power set of {1, 2}?", options: ["{1},{2}", "{{},{1},{2},{1,2}}", "{{1,2}}", "{1,2,3}"], correct: 1, explanation: "The power set contains all subsets including the empty set and the full set.", topic: "Set Theory", difficulty: "Easy" },
      { question: "How many edges does a complete graph K₅ have?", options: ["5", "10", "15", "20"], correct: 1, explanation: "K_n has n(n-1)/2 edges. K₅ = 5×4/2 = 10.", topic: "Graph Theory", difficulty: "Medium" },
      { question: "What is a bijection?", options: ["A function that is only one-to-one", "A function that is only onto", "A function that is both one-to-one and onto", "A partial function"], correct: 2, explanation: "A bijection is a function that is both injective (one-to-one) and surjective (onto).", topic: "Functions", difficulty: "Medium" },
      { question: "What is the principle of inclusion-exclusion?", options: ["|A∪B| = |A|+|B|", "|A∪B| = |A|+|B|-|A∩B|", "|A∩B| = |A|+|B|", "|A-B| = |A|-|B|"], correct: 1, explanation: "Inclusion-exclusion: |A∪B| = |A| + |B| - |A∩B| to avoid double counting.", topic: "Combinatorics", difficulty: "Medium" },
      { question: "How many permutations does n-factorial represent?", options: ["n + (n-1)", "n * (n-1) * ... * 1", "n ^ n", "2 ^ n"], correct: 1, explanation: "n! counts all ordered arrangements of n items.", topic: "Combinatorics", difficulty: "Easy" },
      { question: "What is a Hamiltonian path?", options: ["A path visiting every edge once", "A path visiting every vertex exactly once", "The shortest path", "A cycle"], correct: 1, explanation: "A Hamiltonian path visits every vertex of a graph exactly once.", topic: "Graph Theory", difficulty: "Medium" },
      { question: "What is an Euler path?", options: ["A path visiting every vertex once", "A path visiting every edge exactly once", "A cycle", "A spanning tree path"], correct: 1, explanation: "An Euler path traverses every edge of a graph exactly once.", topic: "Graph Theory", difficulty: "Medium" },
      { question: "What is the contrapositive of 'If P then Q'?", options: ["If Q then P", "If not P then not Q", "If not Q then not P", "Not P and not Q"], correct: 2, explanation: "The contrapositive of P→Q is ¬Q→¬P, which is logically equivalent to the original.", topic: "Logic", difficulty: "Medium" },
      { question: "How many ways can you arrange n distinct items in r positions?", options: ["n!/r!", "n!/(n-r)!", "nCr", "rⁿ"], correct: 1, explanation: "nPr = n!/(n-r)! counts ordered arrangements (permutations).", topic: "Combinatorics", difficulty: "Medium" },
    ],
  },

  // ─── 9. Object-Oriented Programming ──────────────────────────
  {
    id: "oop",
    name: "Object-Oriented Programming",
    icon: "🏗️",
    color: "#14b8a6",
    colorBg: "rgba(20,184,166,0.12)",
    category: "programming",
    badge: "",
    description: "Classes, objects, inheritance, polymorphism, encapsulation, and design patterns.",
    tags: ["Classes", "Inheritance", "Polymorphism", "Design Patterns", "SOLID"],
    questions: [
      { question: "What are the four pillars of OOP?", options: ["Inheritance, Polymorphism, Encapsulation, Abstraction", "Loops, Functions, Variables, Classes", "Objects, Methods, Fields, Instances", "SOLID, GRASP, DRY, YAGNI"], correct: 0, explanation: "The four pillars of OOP are Encapsulation, Abstraction, Inheritance, and Polymorphism (EAIP).", topic: "OOP Concepts", difficulty: "Easy" },
      { question: "What is encapsulation?", options: ["Hiding implementation details inside a class", "Extending a parent class", "Overriding methods", "Creating objects"], correct: 0, explanation: "Encapsulation bundles data and methods together and restricts direct access from outside.", topic: "OOP Concepts", difficulty: "Easy" },
      { question: "What is method overriding?", options: ["Defining multiple methods with the same name but different parameters", "Redefining a parent class method in a child class", "Calling a method multiple times", "Deleting a method"], correct: 1, explanation: "Overriding: a subclass provides a specific implementation of a method already defined in its parent.", topic: "Polymorphism", difficulty: "Easy" },
      { question: "What is the difference between method overloading and overriding?", options: ["Overloading is compile-time; overriding is runtime polymorphism", "They are the same", "Overriding is compile-time; overloading is runtime", "Neither is polymorphism"], correct: 0, explanation: "Overloading = same method name, different params (compile-time). Overriding = redefine parent method (runtime).", topic: "Polymorphism", difficulty: "Medium" },
      { question: "What is an abstract class?", options: ["A class with no methods", "A class that cannot be instantiated and may have abstract methods", "A class with only static methods", "A final class"], correct: 1, explanation: "An abstract class cannot be instantiated and may declare abstract methods that subclasses must implement.", topic: "Abstraction", difficulty: "Medium" },
      { question: "What is the 'S' in SOLID principles?", options: ["Single Responsibility Principle", "Separation of Concerns", "Static Method Principle", "Strict Object Principle"], correct: 0, explanation: "S = Single Responsibility Principle: a class should have only one reason to change.", topic: "SOLID", difficulty: "Medium" },
      { question: "What design pattern is Singleton?", options: ["Structural", "Behavioral", "Creational", "Architectural"], correct: 2, explanation: "Singleton is a creational pattern — it ensures a class has only one instance.", topic: "Design Patterns", difficulty: "Medium" },
      { question: "What is the Observer pattern?", options: ["One-to-one communication between objects", "A subject notifies multiple observers when state changes", "Wrapping an interface", "Lazy initialization"], correct: 1, explanation: "Observer pattern: an object (subject) maintains a list of observers and notifies them of state changes.", topic: "Design Patterns", difficulty: "Medium" },
      { question: "What is composition vs inheritance?", options: ["They are the same", "Composition: 'has-a'; Inheritance: 'is-a' relationship", "Inheritance: 'has-a'; Composition: 'is-a'", "Composition only works in functional programming"], correct: 1, explanation: "Inheritance = 'is-a' (Dog is-a Animal). Composition = 'has-a' (Car has-a Engine).", topic: "OOP Concepts", difficulty: "Medium" },
      { question: "What is polymorphism?", options: ["A class inheriting from multiple parents", "The ability of different objects to respond to the same message in different ways", "Only method overloading", "Restricting class access"], correct: 1, explanation: "Polymorphism allows objects of different types to be accessed through the same interface.", topic: "Polymorphism", difficulty: "Easy" },
    ],
  },

  // ─── 10. Software Engineering ─────────────────────────────────
  {
    id: "software-eng",
    name: "Software Engineering",
    icon: "🛠️",
    color: "#84cc16",
    colorBg: "rgba(132,204,22,0.12)",
    category: "core",
    badge: "",
    description: "SDLC, Agile, testing, design principles, version control, and project management.",
    tags: ["SDLC", "Agile", "Testing", "Design Patterns", "Git"],
    questions: [
      { question: "What does SDLC stand for?", options: ["Software Design Life Cycle", "Software Development Life Cycle", "System Development Language Criteria", "System Design and Logic Cycle"], correct: 1, explanation: "SDLC is the Software Development Life Cycle — the process used for planning, creating, testing, and deploying software.", topic: "SDLC", difficulty: "Easy" },
      { question: "What is Agile methodology?", options: ["A waterfall model variant", "Iterative development with regular feedback", "A testing framework", "A programming language"], correct: 1, explanation: "Agile is iterative and incremental, emphasizing collaboration, flexibility, and rapid delivery.", topic: "Agile", difficulty: "Easy" },
      { question: "What is unit testing?", options: ["Testing the entire system", "Testing individual components in isolation", "Testing by end users", "Performance testing"], correct: 1, explanation: "Unit testing tests individual components or functions in isolation.", topic: "Testing", difficulty: "Easy" },
      { question: "What is the difference between verification and validation?", options: ["No difference", "Verification: building the product right; Validation: building the right product", "Validation: building the product right; Verification: building the right product", "Both are the same type of testing"], correct: 1, explanation: "Verification = 'Are we building the product right?' / Validation = 'Are we building the right product?'", topic: "Testing", difficulty: "Medium" },
      { question: "What is a sprint in Scrum?", options: ["A bug report", "A fixed iteration period (1-4 weeks) where a working increment is built", "A type of test", "A release process"], correct: 1, explanation: "A sprint is a time-boxed iteration (typically 1-4 weeks) in which a team completes a set of work.", topic: "Agile", difficulty: "Easy" },
      { question: "What is cyclomatic complexity?", options: ["Code length measurement", "A measure of the number of linearly independent paths through a program", "Memory usage", "Number of bugs"], correct: 1, explanation: "Cyclomatic complexity measures the number of independent execution paths — higher = more complex and harder to test.", topic: "Code Quality", difficulty: "Hard" },
      { question: "What does 'TDD' stand for?", options: ["Test Driven Design", "Test Driven Development", "Technical Design Document", "Task-Driven Development"], correct: 1, explanation: "TDD = Test Driven Development: write tests first, then write code to make tests pass.", topic: "Testing", difficulty: "Easy" },
      { question: "What is a use case diagram?", options: ["A flowchart", "A UML diagram showing interactions between users and a system", "An ER diagram", "A class diagram"], correct: 1, explanation: "Use case diagrams show the functional requirements of a system from a user perspective.", topic: "UML", difficulty: "Easy" },
      { question: "What is version control?", options: ["Managing software versions for sale", "Tracking and managing changes to code over time", "A build tool", "A deployment strategy"], correct: 1, explanation: "Version control (like Git) tracks code changes, enables collaboration, and allows reverting to previous states.", topic: "Version Control", difficulty: "Easy" },
      { question: "What is the difference between black-box and white-box testing?", options: ["No difference", "Black-box: no knowledge of internals; White-box: full knowledge of internals", "Black-box: slow; White-box: fast", "Black-box: unit tests; White-box: integration tests"], correct: 1, explanation: "Black-box testing tests without knowing internals; white-box testing uses knowledge of the code structure.", topic: "Testing", difficulty: "Medium" },
    ],
  },

  {
    id: "devops",
    name: "DevOps",
    icon: "☁️",
    color: "#22c55e",
    colorBg: "rgba(34,197,94,0.12)",
    category: "devops",
    badge: "NEW",
    description: "CI/CD, containers, IaC, cloud platforms, monitoring, and automation best practices.",
    tags: ["CI/CD", "Docker", "Kubernetes", "Terraform", "Monitoring"],
    questions: [
      { question: "What is the primary goal of CI/CD?", options: ["Manage project requirements", "Automate code deployment and testing", "Secure network traffic", "Design database schemas"], correct: 1, explanation: "CI/CD automates building, testing, and deploying code to reduce manual errors and deliver faster releases.", topic: "CI/CD", difficulty: "Easy" },
      { question: "Which tool is commonly used for containerization?", options: ["Terraform", "Docker", "Jenkins", "Ansible"], correct: 1, explanation: "Docker packages applications and dependencies into portable containers.", topic: "Containers", difficulty: "Easy" },
      { question: "What does 'Infrastructure as Code' mean?", options: ["Writing code for applications only", "Managing infrastructure using declarative configuration files", "Deploying apps manually", "Using code comments to document servers"], correct: 1, explanation: "Infrastructure as Code uses files like Terraform or CloudFormation templates to provision infrastructure automatically.", topic: "IaC", difficulty: "Medium" },
      { question: "What is a Kubernetes Pod?", options: ["A virtual machine", "A group of one or more containers with shared networking", "A deployment pipeline", "A logging tool"], correct: 1, explanation: "A Pod is the smallest deployable unit in Kubernetes containing one or more containers.", topic: "Kubernetes", difficulty: "Easy" },
      { question: "What is the purpose of a Canary deployment?", options: ["Delete old releases", "Test changes with a small subset of users before full rollout", "Back up databases", "Scale pods automatically"], correct: 1, explanation: "Canary deployments release changes to a small segment of traffic first to catch issues early.", topic: "Deployments", difficulty: "Medium" },
      { question: "Which tool is used for provisioning cloud resources declaratively?", options: ["Jenkins", "Terraform", "Git", "Prometheus"], correct: 1, explanation: "Terraform provisions cloud infrastructure using declarative configuration files.", topic: "IaC", difficulty: "Easy" },
      { question: "What is the difference between monitoring and logging?", options: ["They are the same", "Monitoring observes system health; logging records detailed events", "Logging stops services; monitoring starts them", "Monitoring only for security"], correct: 1, explanation: "Monitoring tracks metrics and alerts; logging records events and details for troubleshooting.", topic: "Monitoring", difficulty: "Medium" },
      { question: "Which DevOps practice helps teams manage infrastructure changes safely?", options: ["Manual deployment", "Immutable infrastructure", "Untracked configuration", "Ad hoc server setup"], correct: 1, explanation: "Immutable infrastructure means replacing servers instead of changing them in place, reducing configuration drift.", topic: "Infrastructure", difficulty: "Medium" },
      { question: "What does GitOps mean?", options: ["Deploying from a git repository using automation", "Using Git for version control only", "A security framework", "A monitoring tool"], correct: 0, explanation: "GitOps uses Git as the single source of truth for declarative infrastructure and application deployments.", topic: "Automation", difficulty: "Medium" },
      { question: "What role does continuous testing serve in DevOps?", options: ["Only manual QA", "Running automated tests on every code change", "Deploying unrelated services", "Monitoring server uptime"], correct: 1, explanation: "Continuous testing validates changes automatically as part of the CI/CD pipeline.", topic: "CI/CD", difficulty: "Medium" },
    ],
  },

  // ─── 11. C Programming ────────────────────────────────────────
  {
    id: "c-programming",
    name: "C Programming",
    icon: "©️",
    color: "#0ea5e9",
    colorBg: "rgba(14,165,233,0.12)",
    category: "programming",
    badge: "",
    description: "Pointers, memory management, I/O, structs, and the fundamentals of C.",
    tags: ["Pointers", "Memory", "Structs", "I/O", "Functions"],
    questions: [
      { question: "What does a pointer store?", options: ["A value", "A memory address", "A string", "A function"], correct: 1, explanation: "A pointer stores the memory address of another variable.", topic: "Pointers", difficulty: "Easy" },
      { question: "What is the output of sizeof(int) on a 32-bit system?", options: ["1", "2", "4", "8"], correct: 2, explanation: "On a 32-bit system, int is typically 4 bytes.", topic: "Data Types", difficulty: "Easy" },
      { question: "What does malloc() do?", options: ["Free memory", "Allocate memory on the stack", "Allocate memory on the heap", "Reallocate memory"], correct: 2, explanation: "malloc() dynamically allocates a block of memory on the heap and returns a pointer to it.", topic: "Memory Management", difficulty: "Easy" },
      { question: "What is a null pointer?", options: ["A pointer to zero", "A pointer with no valid address (points to nothing)", "A pointer to the first memory location", "An invalid variable"], correct: 1, explanation: "A null pointer is a pointer initialized to NULL (0), meaning it doesn't point to any valid memory.", topic: "Pointers", difficulty: "Easy" },
      { question: "What is the difference between struct and union?", options: ["No difference", "Struct: each member has its own memory; Union: all members share the same memory", "Union: each member has its own memory; Struct: shared memory", "Union is faster always"], correct: 1, explanation: "In a struct, each field has its own storage. In a union, all fields share the same memory location.", topic: "Structs", difficulty: "Medium" },
      { question: "What does the '&' operator do in C?", options: ["Bitwise AND", "Gets the address of a variable", "Both A and B", "Neither"], correct: 2, explanation: "In C, '&' is both the bitwise AND operator and the address-of operator depending on context.", topic: "Operators", difficulty: "Medium" },
      { question: "What is a segmentation fault?", options: ["A divide by zero error", "A program accessing memory it doesn't own", "A stack overflow", "A compilation error"], correct: 1, explanation: "Segfault occurs when a program attempts to access memory it doesn't have permission to access.", topic: "Memory Management", difficulty: "Medium" },
      { question: "What is the difference between ++i and i++?", options: ["No difference", "++i increments first then uses; i++ uses first then increments", "i++ is faster", "++i decrements"], correct: 1, explanation: "Pre-increment (++i) increments before use; post-increment (i++) uses the value then increments.", topic: "Operators", difficulty: "Medium" },
      { question: "What does 'free()' do in C?", options: ["Frees CPU cycles", "Deallocates heap memory", "Deletes a file", "Closes a file descriptor"], correct: 1, explanation: "free() releases dynamically allocated heap memory back to the system.", topic: "Memory Management", difficulty: "Easy" },
      { question: "What is a function pointer in C?", options: ["A pointer to the return value of a function", "A pointer that stores the address of a function", "A parameter of a function", "A recursive function"], correct: 1, explanation: "A function pointer stores the address of a function and can be used to call it dynamically.", topic: "Functions", difficulty: "Hard" },
    ],
  },

  // ─── 12. Artificial Intelligence ─────────────────────────────
  {
    id: "ai",
    name: "Artificial Intelligence",
    icon: "🤖",
    color: "#a855f7",
    colorBg: "rgba(168,85,247,0.12)",
    category: "core",
    badge: "NEW",
    description: "Search algorithms, knowledge representation, machine learning, and planning.",
    tags: ["Search", "ML", "Neural Networks", "Planning", "NLP"],
    questions: [
      { question: "What is the difference between BFS and DFS in AI search?", options: ["BFS is depth-first; DFS is breadth-first", "BFS explores level by level; DFS explores one path deeply before backtracking", "They are the same", "DFS is always optimal"], correct: 1, explanation: "BFS explores all nodes at depth d before depth d+1. DFS goes deep along one branch first.", topic: "Search", difficulty: "Easy" },
      { question: "What is A* search?", options: ["A random search", "An informed search using f(n)=g(n)+h(n)", "A greedy search", "A blind search"], correct: 1, explanation: "A* uses f(n) = g(n) + h(n), combining actual cost g and heuristic h to find the optimal path.", topic: "Search", difficulty: "Medium" },
      { question: "What is the difference between supervised and unsupervised learning?", options: ["No difference", "Supervised: labeled data; Unsupervised: unlabeled data", "Supervised: testing only; Unsupervised: training only", "Supervised is newer"], correct: 1, explanation: "Supervised learning uses labeled training data. Unsupervised learning finds patterns in unlabeled data.", topic: "Machine Learning", difficulty: "Easy" },
      { question: "What is overfitting?", options: ["Model performs well on all data", "Model memorizes training data and performs poorly on new data", "Model is too simple", "Model uses too little data"], correct: 1, explanation: "Overfitting: the model fits training data too well but fails to generalize to unseen data.", topic: "Machine Learning", difficulty: "Medium" },
      { question: "What is a Neural Network?", options: ["A biological brain", "A computational model inspired by the brain with layers of nodes", "A database architecture", "A sorting algorithm"], correct: 1, explanation: "Neural networks are interconnected layers of nodes (neurons) that learn to model complex patterns.", topic: "Neural Networks", difficulty: "Easy" },
      { question: "What activation function is commonly used in hidden layers of deep networks?", options: ["Sigmoid", "Step function", "ReLU", "Linear"], correct: 2, explanation: "ReLU (Rectified Linear Unit) is preferred for hidden layers as it avoids vanishing gradients.", topic: "Neural Networks", difficulty: "Medium" },
      { question: "What is the vanishing gradient problem?", options: ["GPU memory overflowing", "Gradients become very small, preventing lower layers from learning", "Too much data causing slow training", "Overfitting in small networks"], correct: 1, explanation: "In deep networks, gradients shrink as they propagate back, making early layer weights barely update.", topic: "Neural Networks", difficulty: "Hard" },
      { question: "What is reinforcement learning?", options: ["Learning from labeled data", "Learning by receiving rewards/penalties through interaction with an environment", "Clustering unlabeled data", "Supervised classification"], correct: 1, explanation: "Reinforcement learning: an agent takes actions to maximize cumulative reward through trial and error.", topic: "Machine Learning", difficulty: "Medium" },
      { question: "What is the minimax algorithm used for?", options: ["Minimum spanning tree", "Optimal decision-making in two-player games", "Sorting", "Pathfinding"], correct: 1, explanation: "Minimax finds the optimal move in two-player zero-sum games by minimizing the opponent's maximum gain.", topic: "Search", difficulty: "Medium" },
      { question: "What is cross-validation?", options: ["Comparing two ML models", "A technique to estimate model performance by splitting data into training/test folds", "Validating database records", "A neural network layer"], correct: 1, explanation: "Cross-validation evaluates ML models by partitioning data into complementary training and testing sets.", topic: "Machine Learning", difficulty: "Medium" },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    await Subject.deleteMany({});
    console.log("Cleared existing data...");

    await Subject.insertMany(seedData);
    console.log(`✅ Seeded ${seedData.length} subjects successfully!`);

    const total = seedData.reduce((acc, s) => acc + s.questions.length, 0);
    console.log(`   Total questions seeded: ${total}`);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
