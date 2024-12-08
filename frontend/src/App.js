import React, { useState } from "react";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Crud from "./Components/Crud";

function App() {
  const [token, setToken] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  // Handle the user clicking "Register" on the Login component
  const handleShowRegister = () => setShowRegister(true);

  if (!token) {
    return (
      <div>
        {showRegister ? (
          <Register setShowRegister={setShowRegister} />
        ) : (
          <Login setToken={setToken} handleShowRegister={handleShowRegister} />
        )}
      </div>
    );
  }

  return (
    <div>
      <Crud token={token} />
    </div>
  );
}

export default App;
