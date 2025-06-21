import "./authentication.css";
const Authentication = () => {
  return (
    <div className="container">
      <div className="left">
        <div className="login-section">
          <header>
            <h2 className="animation a1">Coding Vibes</h2>
            <h4 className="animation a2">
              Welcome back, Please login to your account
            </h4>
          </header>
          <form>
            <input
              type="email"
              placeholder="Email"
              className="input-field animation a3"
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field animation a4"
            />
            <p className="animation a5">
              <a href="#">Forgot password?</a>
            </p>
            <button className="animation a6">Sign in</button>
          </form>
        </div>
      </div>
      <div className="right"></div>
    </div>
  );
};

export default Authentication;
