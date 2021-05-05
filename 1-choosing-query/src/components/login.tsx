import "./login.css";
import alembic from "../assets/alembic.svg";
import octopus from "../assets/octopus.svg";
import testTube from "../assets/test-tube.svg";
import React from "react";

const images = [
  { alt: "octopus", src: octopus },
  { alt: "alembic", src: alembic },
  { alt: "test tube", src: testTube },
];

function submit(): Promise<void> {
  // Simulate network request
  return new Promise((resolve) => resolve());
}

const Login: React.FC = () => {
  const [message, setMessage] = React.useState("");
  function handleChange() {
    setMessage("");
  }
  function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    submit()
      .then(() => setMessage("Success"))
      .catch((err) => setMessage(err.message));
  }
  return (
    <form data-testid="loginform" className="loginform" onSubmit={handleSubmit}>
      <div className="loginform__info">
        {images.map(({ alt, src }) => (
          <img
            key={alt}
            src={src}
            width="36"
            height="36"
            alt={alt}
            title={`${alt} title`}
          />
        ))}
        <p>Sign in to your account</p>
      </div>
      <label className="loginform__label">
        Username
        <input
          type="text"
          name="username"
          className="loginform__input"
          placeholder="Username or email"
          autoComplete="username"
          onChange={handleChange}
          required
        />
      </label>
      <label className="loginform__label">
        Password
        <input
          type="password"
          name="password"
          className="loginform__input"
          placeholder="Password"
          autoComplete="current-password"
          onChange={handleChange}
          required
        />
      </label>
      <input className="loginform__submit" type="submit" />
      {message ? (
        <span role="alert" className="loginform__alert">
          {message}
        </span>
      ) : null}
    </form>
  );
};
export default Login;
