import axios from "axios";

async function runCodeWithGemini(options: any) {
  const {
    code,
    problemDescription = "",
    problemId = "custom",
    timeLimit = 3000,
    memoryLimit = 512,
  } = options;

  try {
    const apiUrl = `https://unikitab-backend-4.onrender.com/api/v1/codeRunner/gemini-format-run`;
    // const apiUrl = process.env.NEXT_APP_API_URL
    //   ? `${process.env.NEXT_APP_API_URL}/api/v1/codeRunner/gemini-format-run`
    //   : "https://unikitab-backend-4.onrender.com/api/v1/codeRunner/gemini-format-run";

    const response = await axios({
      method: "post",
      url: apiUrl,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        code,
        problemDescription,
        problemId,
        timeLimit,
        memoryLimit,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function testCodeRunner(code: string, problemDescription: string) {
  try {
    const result = await runCodeWithGemini({
      code: `${code}`,
      problemDescription,
    });

    const { summary, results } = result.data.results;
    const formattedResult = {
      status:
        summary.failed === 0
          ? "✅ All tests passed"
          : `❌ ${summary.failed} tests failed`,
      testsPassed: `${summary.passed}/${summary.total}`,
      passRate: `${summary.passPercentage.toFixed(2)}%`,
      executionTime: `${summary.totalExecutionTime.toFixed(4)}ms`,
    };

    // console.log(code);
    console.table(formattedResult);

    if (summary.failed > 0) {
      // console.log("\n🔍 Failed Test Cases:");
      //@ts-ignore
      results.forEach((testResult, index) => {
        if (!testResult.passed) {
          // console.log(`\n❌ Test Case #${index + 1}:`);
          // console.log(`Input:    ${JSON.stringify(testResult.input)}`);
          // console.log(`Expected: ${JSON.stringify(testResult.expected)}`);
          // console.log(`Actual:   ${JSON.stringify(testResult.actual)}`);

          if (testResult.error) {
            // console.log(`Error:    ${testResult.error}`);
          }

          if (testResult.consoleOutput && testResult.consoleOutput.length > 0) {
            // console.log("Console Output:");
            //@ts-ignore
            testResult.consoleOutput.forEach((log) => console.log(`  ${log}`));
          }
        }
      });
    }

    return {
      summary,
      results,
      formattedResult,
    };
  } catch (error) {
    console.error("Failed to run code:", error);
    throw error;
  }
}
