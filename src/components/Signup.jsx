import API from "./axios";

export default function Signup({ setLoginIsShown }) {
  function handleSignup(formData) {
    const username = formData.get("username");
    const password = formData.get("password");

    API.post("/auth/signup", { username, password })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          alert("Signup successful.");
          setLoginIsShown(true);
        }
      })
      .catch((error) => {
        console.error("Signup Error:", error);
        alert("Username already taken");
      });
  }

  return (
    <div className="loading-container">
      <form action={handleSignup} className="login">
        <h1>Signup</h1>
        <span>Username:</span>
        <input type="text" name="username" required />
        <br />
        <span>Password:</span>
        <input type="password" name="password" required />
        <br />
        <button>Signup</button>
        <br />
        <a onClick={() => setLoginIsShown(true)}>Already have an account</a>
      </form>
    </div>
  );
}
