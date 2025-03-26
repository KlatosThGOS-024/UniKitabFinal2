// src/components/CodeTestResults.tsx
import { IRootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";

const CodeTestResults: React.FC = () => {
  const { summary, results, formattedResult, loading, error } = useSelector(
    (state: IRootState) => state.codeTestResultsReducer
  );

  if (loading) {
    return <div className="p-4 bg-gray-100 rounded">Running tests...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!summary || !formattedResult) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-bold mb-4">Test Results</h2>

      {/* Summary */}
      <div className="mb-4">
        <h3 className="font-bold text-lg">{formattedResult.status}</h3>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <span className="font-semibold">Tests Passed:</span>{" "}
            {formattedResult.testsPassed}
          </div>
          <div>
            <span className="font-semibold">Pass Rate:</span>{" "}
            {formattedResult.passRate}
          </div>
          <div>
            <span className="font-semibold">Execution Time:</span>{" "}
            {formattedResult.executionTime}
          </div>
        </div>
      </div>

      {summary.failed > 0 && results && (
        <div>
          <h3 className="font-bold text-lg mb-2">Failed Test Cases:</h3>
          {results
            .filter((test) => !test.passed)

            .map((test, index) => (
              <div
                key={index}
                className="bg-red-50 p-3 rounded mb-2 border border-red-200"
              >
                <div className="mb-1">
                  <span className="font-semibold">Test Case #{index + 1}</span>
                </div>
                <div className="mb-1">
                  <span className="font-semibold">Input:</span>{" "}
                  {JSON.stringify(test.input)}
                </div>
                <div className="mb-1">
                  <span className="font-semibold">Expected:</span>{" "}
                  {JSON.stringify(test.expected)}
                </div>
                <div className="mb-1">
                  <span className="font-semibold">Actual:</span>{" "}
                  {JSON.stringify(test.actual)}
                </div>

                {test.error && (
                  <div className="mb-1">
                    <span className="font-semibold">Error:</span> {test.error}
                  </div>
                )}

                {test.consoleOutput && test.consoleOutput.length > 0 && (
                  <div>
                    <span className="font-semibold">Console Output:</span>
                    <pre className="bg-gray-800 text-white p-2 rounded mt-1 overflow-x-auto">
                      {test.consoleOutput.map((log, i) => (
                        <div key={i}>{log}</div>
                      ))}
                    </pre>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CodeTestResults;
