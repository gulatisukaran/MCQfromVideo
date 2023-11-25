import OpenAIApi from "openai"
import { useState } from "react";
const OPEN_AI_KEY = "YOUR OPEN AI KEY";

const openai = new OpenAIApi({apiKey: OPEN_AI_KEY, dangerouslyAllowBrowser: true});

const apiResponse = async (text) => {
  const completion = await openai.chat.completions.create({
    messages: [
        {
          role: "system",
          content: `Generate 5 mcq questions based on the given input text content. provide 4 possible options and 1 correct answer.
          Format it using backticks to correctly represent the output.
          `,
        },
        { role: "user", content:  text},
      ],
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "text" },
    });
    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
}

export default apiResponse;