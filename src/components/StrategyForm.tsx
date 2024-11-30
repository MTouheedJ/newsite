import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router"; // Import useRouter from Next.js

const StrategyForm = () => {
  const [name, setName] = useState(""); // State for strategy name
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL; // Fetch from environment variables
        if (!backendUrl) {
          throw new Error("NEXT_PUBLIC_BACKEND_URL is not set in the environment variables.");
        }

        await axios.post(`${backendUrl}/strategies/`, { name }); // Corrected URL handling
        setName("");
        alert("Strategy added successfully!");
        router.push("/"); // Redirect to the home page
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Error adding strategy:", error.response?.data || error.message);
          alert("Failed to add strategy. Please check your connection or server.");
        } else {
          console.error("Unknown error:", error);
          alert("An unknown error occurred. Please try again.");
        }
      }
    } else {
      alert("Please enter a strategy name.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <input
        type="text"
        placeholder="Strategy Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 15px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Add Strategy
      </button>
    </form>
  );
};

export default StrategyForm;
