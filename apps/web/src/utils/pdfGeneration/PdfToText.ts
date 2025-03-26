import { getDocument } from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";

class PdfToText {
  pages: number = 0;
  text: string | undefined;
  pdfPath: string | URL;
  pdf: any;
  constructor(pdfPath: string) {
    this.pdfPath = pdfPath;
    this.pdf = getDocument(this.pdfPath).promise;
  }

  async getPdfPages() {
    try {
      const response = await this.pdf;
      this.pages = response.numPages;

      return this.pages;
    } catch (error) {
      console.error("Error loading PDF:", error);
      throw new Error("Failed to load PDF");
    }
  }

  async getTextualData(start: number, end: number) {
    try {
      const pdf = await this.pdf;

      let textContent = "";
      for (let i = +start; i <= +end; i++) {
        let textPage = await pdf.getPage(i);

        let text = await textPage.getTextContent();
        textContent = text.items
          .map((item: TextItem) => {
            return item.str;
          })
          .join(" ");
        textContent += "\n\n\n";
        this.text += textContent;
      }

      return this.text;
    } catch (error) {
      console.error("Error loading PDF:", error);
      throw new Error("Failed to load PDF");
    }
  }
}

export default PdfToText;
