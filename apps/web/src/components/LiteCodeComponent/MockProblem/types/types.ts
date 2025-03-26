export interface ResponseProblem {
  problemNumber: string;
  problemId: string;
  problemTitle: string;
  inputText1: string;
  inputText2?: string;
  inputText3?: string;
  difficulty: Difficulty;
  likesCount: number;
  dislikeCount: number;
  handlerFunc: ((fn: string) => boolean) | string;
  starterFunction: string;
}

export interface ResponseTestCases {
  id: string;
  problemId: string;
  input: string;
  output: string;
}

export interface ResponseExample {
  id: string;
  problemId: string;
  inputText: string;
  outputText: string;
  explanation?: string;
  img?: string;
}

export interface Example {
  problemId: string;
  inputText: string;
  outputText: string;
  explanation?: string;
  img?: string;
}

export interface TestCases {
  input: string;
  problemId: string;
  output: string;
}

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export interface Problem {
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
  handlerFunc: ((fn: string) => boolean) | string;
  starterFunction: string;
}
