import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
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
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await login({ username, password });
      navigate("/");
    } catch (loginError) {
      setError("Invalid username or password.");
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
            required
            mb="sm"
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
            mb="md"
          />
          {error ? (
            <Text color="red" size="sm" mb="sm">
              {error}
            </Text>
          ) : null}
          <Button type="submit" fullWidth>
            Login
          </Button>
          <span style={{ fontSize: "0.875rem", color: "#6c757d", textAlign: "center", display: "block", marginTop: "1rem" }}>
            Try: <span style={{ fontWeight: 700, color: "inherit" }}>emilys / emilyspass</span>
            </span>
        </form>
      </Card>
    </Container>
  );
};

export default Login;
