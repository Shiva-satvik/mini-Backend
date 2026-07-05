const { GoogleGenAI } = require("@google/genai");
const OpenAI = require("openai");

// Clients


const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GEMINI IMAGE GENERATION

const generateWithGemini = async (
  prompt,
  style,
  ratio,
  numImages
) => {
  const finalPrompt = `
Generate ${numImages} high-quality image(s).

Prompt:
${prompt}

Style:
${style}

Aspect Ratio:
${ratio}

Return only the generated images.
`;

  const images = [];

  for (let i = 0; i < Number(numImages); i++) {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: finalPrompt,
    });

    const parts = response?.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.inlineData) {
        images.push({
          image: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
        });
      }
    }
  }

  if (images.length === 0) {
    throw new Error("Gemini returned no images.");
  }

  return { images };
};


// OPENAI IMAGE GENERATION


const generateWithOpenAI = async (
  prompt,
  style,
  ratio,
  numImages
) => {
  const finalPrompt = `
Generate ${numImages} high-quality image(s).

Prompt:
${prompt}

Style:
${style}

Aspect Ratio:
${ratio}
`;

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt: finalPrompt,
    size: "1024x1024",
    n: Number(numImages),
  });

  const images = [];

  for (const img of response.data) {
    images.push({
      image: img.b64_json,
      mimeType: "image/png",
    });
  }

  if (images.length === 0) {
    throw new Error("OpenAI returned no images.");
  }

  return { images };
};

// GEMINI IMAGE REFINEMENT


const refineWithGemini = async (
  originalPrompt,
  refinementPrompt,
  style
) => {
  const finalPrompt = `
Original Prompt:
${originalPrompt}

Refinement Instructions:
${refinementPrompt}

Style:
${style}

Generate the improved image.
`;

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: finalPrompt,
  });

  const images = [];

  const parts = response?.candidates?.[0]?.content?.parts || [];

  for (const part of parts) {
    if (part.inlineData) {
      images.push({
        image: part.inlineData.data,
        mimeType: part.inlineData.mimeType,
      });
    }
  }

  if (images.length === 0) {
    throw new Error("Gemini returned no refined image.");
  }

  return { images };
};


// OPENAI IMAGE REFINEMENT


const refineWithOpenAI = async (
  originalPrompt,
  refinementPrompt,
  style
) => {
  const finalPrompt = `
Original Prompt:
${originalPrompt}

Refinement Instructions:
${refinementPrompt}

Style:
${style}

Generate the improved image.
`;

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt: finalPrompt,
    size: "1024x1024",
    n: 1,
  });

  const images = [];

  for (const img of response.data) {
    images.push({
      image: img.b64_json,
      mimeType: "image/png",
    });
  }

  if (images.length === 0) {
    throw new Error("OpenAI returned no refined image.");
  }

  return { images };
};

// PUBLIC FUNCTIONS (AUTO FALLBACK)


const generateImage = async (
  prompt,
  style,
  ratio,
  numImages
) => {
  try {
    console.log("Generating image with Gemini...");
    return await generateWithGemini(
      prompt,
      style,
      ratio,
      numImages
    );
  } catch (err) {
    console.warn("Gemini failed:", err.message);
    console.log("Falling back to OpenAI...");

    try {
      return await generateWithOpenAI(
        prompt,
        style,
        ratio,
        numImages
      );
    } catch (openaiErr) {
      console.error("OpenAI also failed:", openaiErr.message);
      throw new Error("Both Gemini and OpenAI failed.");
    }
  }
};

const refineImage = async (
  originalPrompt,
  refinementPrompt,
  style
) => {
  try {
    console.log("Refining image with Gemini...");
    return await refineWithGemini(
      originalPrompt,
      refinementPrompt,
      style
    );
  } catch (err) {
    console.warn("Gemini refinement failed:", err.message);
    console.log("Falling back to OpenAI...");

    try {
      return await refineWithOpenAI(
        originalPrompt,
        refinementPrompt,
        style
      );
    } catch (openaiErr) {
      console.error("OpenAI refinement failed:", openaiErr.message);
      throw new Error("Both Gemini and OpenAI failed.");
    }
  }
};

module.exports = {
  generateImage,
  refineImage,
};