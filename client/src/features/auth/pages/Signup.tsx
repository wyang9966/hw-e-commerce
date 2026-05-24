import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Text, Title } from "@mantine/core";

const Signup = () => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <Container size="xs" py="xl">
      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Title order={2} mb="md" ta="center">
          Signup
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          Signup is currently unavailable in this demo version of the store.
        </Text>
        <Button fullWidth mb="md" onClick={() => setShowInfo((current) => !current)}>
          {showInfo ? "Hide login info" : "Show login info"}
        </Button>
        {showInfo ? (
          <Text size="sm">
            Please use the login page with the demo credentials below to access the application.
            <br />
            <Text component="span" fw={700} c="dark">
              Username: emilys
            </Text>
            <br />
            <Text component="span" fw={700} c="dark">
              Password: emilyspass
            </Text>
          </Text>
        ) : null}
        <Button variant="outline" fullWidth mt="md" onClick={() => navigate("/login")}> 
          Back to Sign In
        </Button>
      </Card>
    </Container>
  );
};

export default Signup;
