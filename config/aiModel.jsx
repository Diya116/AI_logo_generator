
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

export async function generateLogo(prompt) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            guidance_scale: 7.5,
            num_inference_steps: 20,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HuggingFace API Error: ${response.status} - ${errorText}`);
    }

    // Handle potential JSON response (model loading, etc.)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const jsonResponse = await response.json();
      
      if (jsonResponse.error) {
        throw new Error(`HuggingFace Error: ${jsonResponse.error}`);
      }
      
      if (jsonResponse.estimated_time) {
        // Wait for model to load and retry
        await new Promise(resolve => setTimeout(resolve, jsonResponse.estimated_time * 1000));
        return generateLogo(prompt); // Recursive retry
      }
      
      throw new Error("Unexpected JSON response from HuggingFace");
    }

    const imageBuffer = await response.arrayBuffer();
    return Buffer.from(imageBuffer);

  } catch (error) {
    console.error("Error generating logo:", error);
    throw error;
  }
}