import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const getWeatherTool = tool({
  name: 'get_weather',
  description: 'returns the current weather information for the given city',
  parameters: z.object({
    city: z.string().describe('name of the city'),
  }),

  execute: async function ({ city }) {
    try {
      const response = await axios.get(`https://wttr.in/${city}?format=j1`);

      const data = response.data;
      const current = data.current_condition[0];

      return `Weather in ${city}:
      Temperature: ${current.temp_C}°C
      Feels Like: ${current.FeelsLikeC}°C
      Condition: ${current.weatherDesc[0].value}
      Wind: ${current.windspeedKmph} km/h
      Humidity: ${current.humidity}%`;
    } catch (error) {
      return `Failed to fetch weather for ${city}. Please try again.`;
    }
  },
});

const agent = new Agent({
  name: 'Weather Agent',
  instructions: `
    You are an expert weather agent that helps user to tell weather report
  `,
  tools: [getWeatherTool],
});

// Example run
const result = await run(agent, "What's the weather in Noida UP India?");
console.log(result.finalOutput);