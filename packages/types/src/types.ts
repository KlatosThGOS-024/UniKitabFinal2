interface ResponseProblem {
  problemNumber: number;
  problemId: string;
  title: string;
  inputText1: string;
  inputText2?: string;
  inputText3?: string;
  difficulty: Difficulty;
  likesCount: number;
  dislikeCount: number;
  handlerFunc: ((fn: any) => boolean) | string;
  starterFunction: string;
}

interface ResponseTestCases {
  id: string;
  problemId: string;
  input: any;
  output: any;
}

interface ResponseExample {
  id: string;
  problemId: string;
  inputText: string;
  outputText: string;
  explanation?: string;
  img?: string;
}

interface Example {
  problemId: string;
  inputText: string;
  outputText: string;
  explanation?: string;
  img?: string;
}

interface TestCases {
  input: any;
  problemId: string;
  output: any;
}

enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

interface Problem {
  problemNumber: string;
  problemId: string;
  problemTitle: string;
  inputText1: string;
  inputText2?: string;
  inputText3?: string;
  difficulty: Difficulty;
  likesCount: number;
  dislikeCount: number;
  examples: Example[];
  testCases: TestCases[];
  handlerFunc: ((fn: any) => boolean) | string;
  starterFunction: string;
}
export {
  Problem,
  ResponseExample,
  ResponseTestCases,
  ResponseProblem,
  Example,
  TestCases,
  Difficulty,
};
