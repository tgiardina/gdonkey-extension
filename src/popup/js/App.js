import React, { useEffect, useState } from "react";
import { getCookies } from "./persistence";
import { Login, Logout } from "./views";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isInit, setIsInit] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    (async () => {
      if (!isInit) {
        const { username, isAuth } = await getCookies();
        setIsAuth(isAuth);
        setIsInit(true);
        setUsername(username || "");
      }
    })();
  });

  return (
    <div className="App">
      <div className="d-inline-block p-3">
        {!isAuth ? (
          <Login
            setIsAuth={setIsAuth}
            setUsername={setUsername}
            username={username}
          />
        ) : (
          <Logout setIsAuth={setIsAuth} username={username} />
        )}
      </div>
    </div>
  );
}

export default App;
