import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asynchHandler";
import { ApiResponse } from "../utils/ApiResponse";
import vm from "vm";
import axios from "axios";

interface TestCase {
  input: any;
  expected: any;
}

interface CodeRunRequest {
  code: string;
  problemDescription?: string;
  timeLimit?: number;
  memoryLimit?: number;
  problemId?: string;
  problemType?: string;
}

interface TestCaseResult {
  input: any;
  expected: any;
  actual: any;
  passed: boolean;
  error?: string;
  executionTime?: number;
  consoleOutput?: string[];
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  passPercentage: number;
  totalExecutionTime: number;
}

const geminiFormatAndRunCode = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        code,
        problemDescription,
        problemId = "custom",
        problemType,
        timeLimit = 3000,
        memoryLimit = 512,
      }: CodeRunRequest = req.body;

      if (!code || typeof code !== "string" || code.trim() === "") {
        throw new ApiError("Code is required and must not be empty", 400);
      }

      const formattedCode = await formatCodeWithGemini(
        code,
        problemDescription
      );

      const testCases = await generateTestCasesWithGemini(
        formattedCode,
        problemDescription ||
          "Generate test cases for the following code: " + code,
        problemId
      );

      if (!testCases || testCases.length === 0) {
        throw new ApiError("Failed to generate test cases", 400);
      }

      const runResults = await runCodeWithTestCases(
        formattedCode,
        testCases,
        timeLimit,
        memoryLimit,
        problemType
      );

      res.json(
        new ApiResponse(200, true, "Code optimized and executed successfully", {
          originalCode: code,
          optimizedCode: formattedCode,
          results: runResults,
        })
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        throw new ApiError(
          `Code runner error: ${error.response?.data?.message || error.message}`,
          error.response?.status || 500
        );
      }

      throw new ApiError(
        `Failed to process code: ${error instanceof Error ? error.message : "Unknown error"}`,
        500
      );
    }
  }
);

async function formatCodeWithGemini(
  code: string,
  problemDescription?: string
): Promise<string> {
  // const api = process.env.AiAPI;
  const api = "AIzaSyBvCHs7Hl_GKc9JhTugUVDT-ulTxNOCwV0";
  if (!api) {
    throw new Error("AI API key is not configured");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${api}`;

  const promptContext = problemDescription
    ? `Given this problem description: "${problemDescription}"`
    : "Based on the code structure and purpose";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${promptContext}, format and optimize the following code for readability and performance:

${code}

Format the code following these requirements:
1. Ensure the solution is implemented through a function named "solution"
2. Keep the same algorithm/approach but improve formatting, variable names, and efficiency
3. Add comments to explain complex logic
4. Fix any potential bugs or edge cases
5. Return only the optimized code, with no explanations before or after

IMPORTANT: Return only the formatted code, no explanations or markdown. The code must have a function named "solution" that accepts the input parameter.
`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`AI service error: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();

  if (
    !data.candidates ||
    !data.candidates[0] ||
    !data.candidates[0].content ||
    !data.candidates[0].content.parts[0]
  ) {
    throw new Error("Invalid response from AI service");
  }

  let formattedCode = data.candidates[0].content.parts[0].text;

  formattedCode = formattedCode.replace(
    /```(?:javascript|js)?\n([\s\S]*?)\n```/g,
    "$1"
  );

  if (!formattedCode.includes("function solution")) {
    const functionMatch = formattedCode.match(/function\s+(\w+)/);
    if (functionMatch && functionMatch[1] !== "solution") {
      formattedCode = formattedCode.replace(
        new RegExp(`function\\s+${functionMatch[1]}`, "g"),
        "function solution"
      );
    } else {
      formattedCode = `function solution(input) {
  ${formattedCode.trim().split("\n").join("\n  ")}
}`;
    }
  }

  return formattedCode;
}

async function generateTestCasesWithGemini(
  code: string,
  description: string,
  problemId: string
): Promise<TestCase[]> {
  //  const api = process.env.AiAPI;
  const api = "AIzaSyBvCHs7Hl_GKc9JhTugUVDT-ulTxNOCwV0";
  if (!api) {
    throw new Error("AI API key is not configured");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${api}`;

  const functionNameMatch = code.match(/function\s+(\w+)/);
  const functionName = functionNameMatch ? functionNameMatch[1] : "solution";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Generate test cases for this algorithm problem:

CODE:
${code}

DESCRIPTION:
${description}

TASK:
Generate a comprehensive JSON array of test cases for the function "${functionName}" that cover normal cases, edge cases, and specific boundary conditions.

IMPORTANT INSTRUCTIONS:
1. FIRST, identify the EXACT purpose of the function by analyzing the code and description. What problem is it solving?
2. SECOND, manually solve 3 small examples step-by-step to understand the algorithm.
3. For each test case, VERIFY your expected output by tracing through the code logic with the input.

FORMAT REQUIREMENTS:
[
  {
    "input": <value that matches the function's expected parameter type>,
    "expected": <value that would be the correct output for this input>
  }
]

INCLUDE THESE TEST CASE TYPES:
1. Simple cases (2-3 examples)
2. Edge cases: empty arrays/strings, single elements, duplicates
3. Large valid inputs (within reasonable bounds)
4. Cases with negative numbers, zeros, or special patterns
5. Boundary cases that test key algorithm transitions

VERIFICATION CHECKLIST:
- Does each expected value match what the function would actually return?
- Are array inputs and outputs properly formatted as arrays?
- Are numeric outputs properly formatted as numbers, not strings?
- For sequence problems: have you correctly counted the sequence length rather than listing elements?
- For graph problems: have you validated the exact structure required?

VALIDATION EXAMPLE:
For "longest consecutive sequence" problem:
- Input [100, 4, 200, 1, 3, 2], Expected: 4 (because [1,2,3,4] is the longest)
- Input [0, 3, 7, 2, 5, 8, 4, 6, 1], Expected: 9 (because [0,1,2,3,4,5,6,7,8] is the longest)

EXPECTED OUTPUT FORMAT: 
Return ONLY the JSON array containing 6-10 test cases with NO additional text or explanations.
`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`AI service error: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();

  if (
    !data.candidates ||
    !data.candidates[0] ||
    !data.candidates[0].content ||
    !data.candidates[0].content.parts[0]
  ) {
    throw new Error("Invalid response from AI service");
  }

  let testCasesText = data.candidates[0].content.parts[0].text;

  testCasesText = testCasesText.replace(
    /```(?:json|js)?\n([\s\S]*?)\n```/g,
    "$1"
  );

  testCasesText = testCasesText
    .replace(/Number\.MAX_SAFE_INTEGER/g, "9007199254740991")
    .replace(/Number\.MIN_SAFE_INTEGER/g, "-9007199254740991")
    .replace(/Number\.MAX_VALUE/g, "1.7976931348623157e+308")
    .replace(/Number\.MIN_VALUE/g, "5e-324")
    .replace(/Number\.POSITIVE_INFINITY/g, "null")
    .replace(/Number\.NEGATIVE_INFINITY/g, "null")
    .replace(/Infinity/g, "null")
    .replace(/NaN/g, "null")
    .replace(/undefined/g, "null")
    .replace(/'/g, '"')
    .replace(/,(\s*[}\]])/g, "$1");

  try {
    let testCases;
    try {
      testCases = JSON.parse(testCasesText);
    } catch (parseError) {
      const jsonMatch = testCasesText.match(/\[\s*{[\s\S]*}\s*\]/);
      if (jsonMatch) {
        testCases = JSON.parse(jsonMatch[0]);
      } else {
        throw parseError;
      }
    }

    if (!Array.isArray(testCases)) {
      throw new Error("Generated test cases are not in an array format");
    }

    const validatedTestCases = testCases.map((testCase) => {
      if (!("input" in testCase) || !("expected" in testCase)) {
        throw new Error(
          "Test case missing required 'input' or 'expected' property"
        );
      }

      return {
        input: JSON.parse(JSON.stringify(testCase.input)),
        expected: JSON.parse(JSON.stringify(testCase.expected)),
      };
    });

    if (validatedTestCases.length < 3) {
      console.warn("Generated fewer than 3 test cases, adding default cases");

      if (code.includes("Array") || code.includes("[]")) {
        validatedTestCases.push({
          input: [],
          expected: extractExpectedEmptyOutput(code),
        });
        validatedTestCases.push({
          input: [1],
          expected: extractExpectedSingleOutput(code),
        });
      }
      if (
        code.includes("String") ||
        code.includes("''") ||
        code.includes('""')
      ) {
        validatedTestCases.push({
          input: "",
          expected: extractExpectedEmptyOutput(code),
        });
        validatedTestCases.push({
          input: "a",
          expected: extractExpectedSingleOutput(code),
        });
      }
    }

    return validatedTestCases;
  } catch (error) {
    console.error("Failed to parse test cases:", testCasesText);
    throw new Error(
      `Failed to parse generated test cases: ${error instanceof Error ? error.message : "Invalid format"}`
    );
  }
}

function extractExpectedEmptyOutput(code: string): any {
  if (code.includes("return 0") || code.includes("= 0")) return 0;
  if (code.includes("return []") || code.includes("= []")) return [];
  if (code.includes('return ""') || code.includes('= ""')) return "";
  if (code.includes("return false") || code.includes("= false")) return false;
  if (code.includes("return null") || code.includes("= null")) return null;

  if (code.includes("Array") || code.includes("[")) return 0;

  if (code.includes("String") || code.includes("'") || code.includes('"'))
    return "";

  return 0;
}

function extractExpectedSingleOutput(code: string): any {
  if (code.includes("return 1") || code.includes("= 1")) return 1;
  if (code.includes("length") || code.includes("size")) return 1;

  if (code.includes("Array") || code.includes("[")) return 1;

  if (code.includes("String") || code.includes("'") || code.includes('"'))
    return 1;

  return 1;
}

async function runCodeWithTestCases(
  code: string,
  testCases: TestCase[],
  timeLimit: number,
  memoryLimit: number,
  problemType?: string
): Promise<{ results: TestCaseResult[]; summary: TestSummary }> {
  const results: TestCaseResult[] = [];
  let passedCount = 0;
  let totalExecutionTime = 0;

  for (const testCase of testCases) {
    const result = await runSingleTestCase(
      code,
      testCase,
      timeLimit,
      problemType
    );
    results.push(result);

    if (result.passed) {
      passedCount++;
    }

    if (result.executionTime) {
      totalExecutionTime += result.executionTime;
    }
  }

  const summary: TestSummary = {
    total: testCases.length,
    passed: passedCount,
    failed: testCases.length - passedCount,
    passPercentage: (passedCount / testCases.length) * 100,
    totalExecutionTime,
  };

  return { results, summary };
}

async function runSingleTestCase(
  code: string,
  testCase: TestCase,
  timeLimit: number,
  problemType?: string
): Promise<TestCaseResult> {
  const result: TestCaseResult = {
    input: testCase.input,
    expected: testCase.expected,
    actual: null,
    passed: false,
    consoleOutput: [],
  };

  const consoleOutput: string[] = [];
  const sandbox = {
    console: {
      log: (...args: any[]) => {
        const output = args
          .map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg) : String(arg)
          )
          .join(" ");
        consoleOutput.push(output);
      },
      error: (...args: any[]) => {
        const output = args
          .map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg) : String(arg)
          )
          .join(" ");
        consoleOutput.push(`ERROR: ${output}`);
      },
      warn: (...args: any[]) => {
        const output = args
          .map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg) : String(arg)
          )
          .join(" ");
        consoleOutput.push(`WARN: ${output}`);
      },
    },
    setTimeout,
    clearTimeout,
    Math,
    Date,
    Array,
    Object,
    String,
    Number,
    Boolean,
    Error,
    JSON,
    RegExp,
    Map,
    Set,
    Promise,
  };

  const context = vm.createContext(sandbox);

  const wrappedCode = `
    (function userCodeRunner(input) {
      try {
        ${code}
        
        // Check if solution function exists
        if (typeof solution !== 'function') {
          throw new Error('Your code must define a function named "solution"');
        }
        
        // Call the solution function with the input
        return solution(input);
      } catch (error) {
        return { error: error.message || 'Unknown error' };
      }
    })
  `;

  try {
    const script = new vm.Script(wrappedCode, {
      filename: "usercode.js",
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Execution timed out after ${timeLimit}ms`));
      }, timeLimit);
    });
    const startTime = performance.now();

    const executionPromise = Promise.resolve().then(() => {
      const userFunction = script.runInContext(context);
      return userFunction(testCase.input);
    });

    const output = await Promise.race([executionPromise, timeoutPromise]);
    const endTime = performance.now();

    result.executionTime = endTime - startTime;
    result.consoleOutput = consoleOutput;

    if (output && output.error) {
      result.error = output.error;
    } else {
      result.actual = output;

      result.passed = smartCompare(output, testCase.expected, problemType);
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Execution error";
    result.consoleOutput = consoleOutput;
  }

  return result;
}

function smartCompare(
  actual: any,
  expected: any,
  problemType?: string
): boolean {
  if (problemType) {
    switch (problemType.toLowerCase()) {
      case "permutation":
      case "combination":
      case "powerset":
      case "subset":
        return compareSetOfSets(actual, expected);
      case "graph":
      case "tree":
        return compareGraphStructures(actual, expected);
      case "sort":
      case "dp":
      case "exact":
        return deepEqual(actual, expected);
    }
  }

  if (isArrayOfArrays(actual) && isArrayOfArrays(expected)) {
    return compareSetOfSets(actual, expected);
  } else if (isSimpleArray(actual) && isSimpleArray(expected)) {
    if (
      actual.length === expected.length &&
      areAllPrimitives(actual) &&
      areAllPrimitives(expected)
    ) {
      return compareUnorderedArrays(actual, expected);
    }
  } else if (typeof actual === "object" && typeof expected === "object") {
    return compareObjects(actual, expected);
  }

  return deepEqual(actual, expected);
}

function isArrayOfArrays(value: any): boolean {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => Array.isArray(item))
  );
}

function isSimpleArray(value: any): boolean {
  return Array.isArray(value);
}

function areAllPrimitives(arr: any[]): boolean {
  return arr.every(
    (item) =>
      typeof item === "string" ||
      typeof item === "number" ||
      typeof item === "boolean" ||
      item === null
  );
}

function compareUnorderedArrays(actual: any[], expected: any[]): boolean {
  if (actual.length !== expected.length) return false;

  const countMap = new Map();

  for (const item of expected) {
    const key = JSON.stringify(item);
    countMap.set(key, (countMap.get(key) || 0) + 1);
  }

  for (const item of actual) {
    const key = JSON.stringify(item);
    const count = countMap.get(key) || 0;
    if (count === 0) return false;
    countMap.set(key, count - 1);
  }

  return true;
}

function compareSetOfSets(actual: any[][], expected: any[][]): boolean {
  if (actual.length !== expected.length) return false;

  const normalizeSet = (set: any[]) => {
    if (areAllPrimitives(set)) {
      return JSON.stringify([...set].sort());
    }
    return JSON.stringify(set.map((item) => JSON.stringify(item)).sort());
  };

  const actualNormalized = new Set(actual.map(normalizeSet));
  const expectedNormalized = new Set(expected.map(normalizeSet));

  if (actualNormalized.size !== expectedNormalized.size) return false;

  for (const item of actualNormalized) {
    if (!expectedNormalized.has(item)) return false;
  }

  return true;
}

function compareObjects(actual: any, expected: any): boolean {
  if (deepEqual(actual, expected)) return true;

  const actualKeys = Object.keys(actual);
  const expectedKeys = Object.keys(expected);

  if (actualKeys.length !== expectedKeys.length) return false;

  for (const key of actualKeys) {
    if (!expected.hasOwnProperty(key)) return false;

    if (isSimpleArray(actual[key]) && isSimpleArray(expected[key])) {
      if (areAllPrimitives(actual[key]) && areAllPrimitives(expected[key])) {
        if (!compareUnorderedArrays(actual[key], expected[key])) return false;
        continue;
      }
    }

    if (!compareObjects(actual[key], expected[key])) return false;
  }

  return true;
}

function compareGraphStructures(actual: any, expected: any): boolean {
  return compareObjects(actual, expected);
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a === null || b === null || a === undefined || b === undefined)
    return false;

  if (typeof a !== typeof b) {
    if (
      (typeof a === "number" && typeof b === "string" && a === Number(b)) ||
      (typeof a === "string" && typeof b === "number" && Number(a) === b)
    ) {
      return true;
    }
    return false;
  }

  if (typeof a === "number" && isNaN(a) && isNaN(b)) return true;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;

      if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  return a == b;
}

const runCode = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {
      code,
      testCases,
      timeLimit = 3000,
      memoryLimit = 512,
      problemType,
    } = req.body;

    if (!code || typeof code !== "string" || code.trim() === "") {
      throw new ApiError("Code is required and must not be empty", 400);
    }

    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      const generatedTestCases = await generateTestCasesWithGemini(
        code,
        "Generate test cases for the following code: " + code,
        "custom"
      );

      if (!generatedTestCases || generatedTestCases.length === 0) {
        throw new ApiError("Failed to generate test cases", 400);
      }

      const results = await runCodeWithTestCases(
        code,
        generatedTestCases,
        timeLimit,
        memoryLimit,
        problemType
      );

      res.json(
        new ApiResponse(
          200,
          true,
          "Successfully executed the code with generated test cases",
          results
        )
      );
    } else {
      const results = await runCodeWithTestCases(
        code,
        testCases,
        timeLimit,
        memoryLimit,
        problemType
      );

      res.json(
        new ApiResponse(200, true, "Successfully executed the code", results)
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Failed to execute code: ${error instanceof Error ? error.message : "Unknown error"}`,
      500
    );
  }
});

export { runCode, geminiFormatAndRunCode };
