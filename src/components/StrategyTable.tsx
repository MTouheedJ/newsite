import axios from "axios";
import { useEffect, useState } from "react";

// Define the Strategy interface
interface Strategy {
  id: number;
  name: string;
}

const StrategyTable = () => {
  // Use explicit typing for strategies
  const [strategies, setStrategies] = useState<Strategy[]>([]);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL; // Fetch from env
        if (!backendUrl) {
          throw new Error("NEXT_PUBLIC_BACKEND_URL is not set in the environment variables.");
        }

        const { data } = await axios.get<Strategy[]>(`${backendUrl}/strategies/`);
        setStrategies(data); // Set the fetched data
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching strategies:", error.response?.data || error.message);
          alert("Failed to fetch strategies. Please check your connection or server.");
        } else {
          console.error("Unknown error:", error);
          alert("An unknown error occurred while fetching strategies.");
        }
      }
    };

    fetchStrategies();
  }, []);

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
      <thead>
        <tr>
          <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>ID</th>
          <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Name</th>
        </tr>
      </thead>
      <tbody>
        {strategies.map((strategy) => (
          <tr key={strategy.id}>
            <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{strategy.id}</td>
            <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{strategy.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StrategyTable;
