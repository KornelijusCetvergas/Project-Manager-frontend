import API from "./axios";

export default function Login({ setLoginIsShown }) {
  function handleLogin(formData) {
    const username = formData.get("username");
    const password = formData.get("password");

    API.post("/auth/login", { username, password })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          localStorage.setItem("token", response.data.jwt);
          localStorage.setItem("username", username);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Login Error:", error);
        alert("Could not Login, please try again later");
      });
  }

  return (
    <div className="loading-container">
      <form action={handleLogin} className="login">
        <h1>Login</h1>
        <span>Username:</span>
        <input type="text" name="username" required />
        <br />
        <span>Password:</span>
        <input type="password" name="password" required />
        <br />
        <button>Login</button>
        <br />
        <a onClick={() => setLoginIsShown(false)}>I do not have an account</a>
      </form>
    </div>
  );
}
