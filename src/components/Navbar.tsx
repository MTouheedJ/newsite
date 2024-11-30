import Link from "next/link";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1a73e8", // Attractive blue background
        color: "white",
        padding: "15px 20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add shadow for depth
        borderBottom: "3px solid #155dbf",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          margin: 0,
        }}
      >
        Trade Tracker
      </h1>
      <div
        style={{
          display: "flex",
          gap: "15px",
          fontSize: "18px",
        }}
      >
        <Link href="/" passHref>
          <span
            style={{
              color: "white",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#155dbf")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            Home
          </span>
        </Link>
        <Link href="/strategies" passHref>
          <span
            style={{
              color: "white",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#155dbf")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            Add Strategy
          </span>
        </Link>
        <Link href="/trades" passHref>
          <span
            style={{
              color: "white",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#155dbf")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            Add Trade
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
