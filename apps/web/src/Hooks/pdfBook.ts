export const addPdfBook = async ({
  file,
  imgSrc,
}: {
  file: File;
  imgSrc: string;
}) => {
  try {
    const formData = new FormData();
    formData.append("PdfFile", file);
    formData.append("imgSrc", imgSrc);

    const apiUrl = `https://criminal-kacy-project223-f659ffae.koyeb.app/api/v1/book/pdf-add`;

    // const apiUrl = process.env.NEXT_APP_API_URL
    //   ? `${process.env.NEXT_APP_API_URL}/api/v1/book/pdf-add`
    //   : "http://localhost:8000/api/v1/book/pdf-add"; // Fallback to localhost if not defined

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getPdfBook = async (search: string) => {
  try {
    const apiUrl = `https://criminal-kacy-project223-f659ffae.koyeb.app/api/v1/book/pdf-get`;

    // const apiUrl = process.env.NEXT_APP_API_URL
    //   ? `${process.env.NEXT_APP_API_URL}/api/v1/book/pdf-get`
    //   : "http://localhost:8000/api/v1/book/pdf-get"; // Fallback to localhost if not defined

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: search }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchPdfUrl = async (fileId: string) => {
  try {
    const apiUrl = `https://criminal-kacy-project223-f659ffae.koyeb.app/api/v1/book/url-get`;

    // const apiUrl = process.env.NEXT_APP_API_URL
    //   ? `${process.env.NEXT_APP_API_URL}/api/v1/book/url-get`
    //   : "http://localhost:8000/api/v1/book/url-get"; // Fallback to localhost if not defined

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch PDF URL");
    }

    const data = await response.json();
    console.log(data.data.downloadUrl);
    return data;
  } catch (error) {
    console.error("Error fetching PDF URL:", error);
    throw error;
  }
};
