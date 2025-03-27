export const getAIresponse = async (message: string) => {
  try {
    // const apiUrl = process.env.REACT_APP_API_URL
    //   ? `${process.env.REACT_APP_API_URL}/api/v1/ai/get-answer`
    //   : "http://localhost:8000/api/v1/ai/get-answer";
    const apiUrl = "http://localhost:8000/api/v1/ai/get-answer";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        getQuestion: message,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    // console.log(error);
  }
};
