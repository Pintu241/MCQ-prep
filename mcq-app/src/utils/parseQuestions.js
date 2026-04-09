/**
 * Parses a plain-text question file into structured question objects.
 *
 * SUPPORTED FORMAT:
 * ─────────────────────────────────────────────────────────────
 * Q: What is the time complexity of binary search?
 * A) O(n)
 * B) O(log n)
 * C) O(n log n)
 * D) O(1)
 * ANSWER: B
 * EXPLANATION: Binary search halves the search space each step.
 *
 * Q: Next question here?
 * ...
 * ─────────────────────────────────────────────────────────────
 * Rules:
 *  - Each question starts with "Q:"
 *  - Options are labeled A) B) C) D) (or A. B. C. D.)
 *  - ANSWER: line specifies the correct letter (A/B/C/D)
 *  - EXPLANATION: is optional
 *  - Blank lines between questions are ignored
 */
export function parseQuestionsFromText(text) {
  const errors = [];
  const questions = [];

  // Split into blocks by "Q:" marker
  const blocks = text
    .split(/(?=^Q:)/im)
    .map((b) => b.trim())
    .filter(Boolean);

  blocks.forEach((block, idx) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const qLine = lines.find((l) => /^Q:/i.test(l));
    if (!qLine) return;

    const questionText = qLine.replace(/^Q:/i, "").trim();
    if (!questionText) {
      errors.push(`Block ${idx + 1}: Empty question text.`);
      return;
    }

    // Extract options A B C D
    const optionRegex = /^([A-D])[).]\s+(.+)$/i;
    const options = [];
    const optionMap = {};
    lines.forEach((line) => {
      const m = line.match(optionRegex);
      if (m) {
        optionMap[m[1].toUpperCase()] = options.length;
        options.push(m[2].trim());
      }
    });

    if (options.length < 2) {
      errors.push(`Block ${idx + 1} ("${questionText.slice(0, 40)}..."): Must have at least 2 options.`);
      return;
    }

    // Extract ANSWER
    const answerLine = lines.find((l) => /^ANSWER:/i.test(l));
    if (!answerLine) {
      errors.push(`Block ${idx + 1} ("${questionText.slice(0, 40)}..."): Missing ANSWER: line.`);
      return;
    }
    const answerLetter = answerLine.replace(/^ANSWER:/i, "").trim().toUpperCase();
    const correctIndex = optionMap[answerLetter];
    if (correctIndex === undefined) {
      errors.push(`Block ${idx + 1}: ANSWER "${answerLetter}" doesn't match any option.`);
      return;
    }

    // Extract EXPLANATION (optional)
    const expLine = lines.find((l) => /^EXPLANATION:/i.test(l));
    const explanation = expLine ? expLine.replace(/^EXPLANATION:/i, "").trim() : "";

    questions.push({
      id: Date.now() + idx,
      question: questionText,
      options,
      correct: correctIndex,
      explanation,
    });
  });

  return { questions, errors };
}

export const SAMPLE_TEXT_FORMAT = `Q: What is the time complexity of binary search?
A) O(n)
B) O(log n)
C) O(n log n)
D) O(1)
ANSWER: B
EXPLANATION: Binary search halves the search space each step, giving O(log n) complexity.

Q: Which data structure uses LIFO order?
A) Queue
B) Array
C) Stack
D) Tree
ANSWER: C
EXPLANATION: Stack follows Last In First Out — the last pushed element is popped first.

Q: What does CPU stand for?
A) Central Processing Unit
B) Core Processing Unit
C) Central Program Utility
D) Compute Processing Unit
ANSWER: A
EXPLANATION: CPU stands for Central Processing Unit, the primary component that executes instructions.`;
