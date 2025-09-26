
// config/aiModel.js
// Dependencies:
// npm install @google/generative-ai mime
import { GoogleGenerativeAI } from "@google/generative-ai";
import mime from "mime";
// import { writeFile } from "fs/promises";

// async function saveBinaryFile(fileName, content) {
//   try {
//     await writeFile(fileName, content);
//     console.log(`File ${fileName} saved to file system.`);
//   } catch (err) {
//     console.error(`Error writing file ${fileName}:`, err);
//   }
// }

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function generateAIResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig 
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}

export async function generateFinalprompt(prompt) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig 
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}