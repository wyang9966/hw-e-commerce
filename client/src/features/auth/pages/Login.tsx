import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUsernameError("");
    setPasswordError("");
    setAuthError("");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    let hasError = false;

    if (!trimmedUsername) {
      setUsernameError("Username is required.");
      hasError = true;
    }

    if (!trimmedPassword) {
      setPasswordError("Password is required.");
      hasError = true;
    } else if (trimmedPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ username: trimmedUsername, password: trimmedPassword });
      navigate(from, { replace: true });
    } catch (loginError) {
      setAuthError("Invalid username or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="xs" py="xl">
      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Title order={2} mb="md" ta="center">
          Login
        </Title>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
            error={usernameError}
            mb="sm"
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            error={passwordError}
            mb="md"
          />
          {authError ? (
            <Text color="red" size="sm" mb="sm">
              {authError}
            </Text>
          ) : null}
          <Button type="submit" fullWidth loading={isSubmitting} disabled={isSubmitting}>
            Login
          </Button>
          <Button
            variant="outline"
            fullWidth
            mt="sm"
            onClick={() => navigate("/signup")}
          >
            Go to Signup
          </Button>
          <Text size="sm" c="dimmed" ta="center" mt="md">
            Demo credentials: <Text component="span" fw={700} c="dark">emilys</Text> / <Text component="span" fw={700} c="dark">emilyspass</Text>
          </Text>
        </form>
      </Card>
    </Container>
  );
};

export default Login;
