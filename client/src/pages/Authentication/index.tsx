import React, { useState, SetStateAction, Dispatch, JSX } from "react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";

import "./authentication.css";

type AuthState = "signin" | "signup" | "";

export default function App(): JSX.Element {
  const [loggedIn, setIsLoggedIn] = useState<AuthState>("");

  return (
    <div className="App">
      <header>
        <h1 className="fake-logo">Level Up</h1>
      </header>
      <main className="layout">
        <button onClick={() => setIsLoggedIn("signin")}>Sign In</button>
        <AnimateSharedLayout>
          <AnimatePresence>
            {loggedIn && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  exit={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="modal"
                >
                  <motion.div layout className="card">
                    {/* ĐÃ XÓA exitBeforeEnter Ở ĐÂY */}
                    <AnimatePresence>
                      {loggedIn === "signin" && (
                        <SignIn key="signin" setIsLoggedIn={setIsLoggedIn} />
                      )}
                      {loggedIn === "signup" && (
                        <SignUp key="signup" setIsLoggedIn={setIsLoggedIn} />
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setIsLoggedIn("")}
                  className="overlay"
                />
              </>
            )}
          </AnimatePresence>
        </AnimateSharedLayout>
      </main>
    </div>
  );
}

interface AuthFormProps {
  setIsLoggedIn: Dispatch<SetStateAction<AuthState>>;
}

function SignUp({ setIsLoggedIn }: AuthFormProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.3 } }}
    >
      <h3>Sign Up</h3>
      <label htmlFor="signup-email">Email</label>
      <input id="signup-email" type="text" />
      <label htmlFor="signup-password">Password</label>
      <input id="signup-password" type="text" />
      <br />
      <button>Sign Up</button>
      <p>
        Already have an account?{" "}
        <a onClick={() => setIsLoggedIn("signin")}>Sign In</a>
      </p>
    </motion.div>
  );
}

function SignIn({ setIsLoggedIn }: AuthFormProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.3 } }}
    >
      <h3>Sign In</h3>
      <label htmlFor="signin-email">Email</label>
      <input id="signin-email" type="text" />
      <label htmlFor="signin-password">Password</label>
      <input id="signin-password" type="text" />
      <label htmlFor="signin-password-confirm">Password Confirm</label>
      <input id="signin-password-confirm" type="text" />
      <br />
      <button>Sign In</button>
      <p>
        Need an account? <a onClick={() => setIsLoggedIn("signup")}>Sign Up</a>
      </p>
    </motion.div>
  );
}
