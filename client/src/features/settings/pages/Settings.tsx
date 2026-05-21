import { useState, useEffect } from "react";
import { Container, Title, Card, Center, Text, Stack } from "@mantine/core";
import { useAuth } from "../../../context/AuthContext";
import { useProfile, useUpdateProfile } from "../../../hooks/useUser";
import { ProfileForm } from "../components/ProfileForm";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.username);
  const updateProfileMutation = useUpdateProfile();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    // Clear success message after 3 seconds
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(undefined), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (!user) {
    return (
      <Container size="md" py="xl">
        <Center h={300}>
          <Text>Please log in to access settings.</Text>
        </Center>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <Center h={300}>
          <Text>Loading profile...</Text>
        </Center>
      </Container>
    );
  }

  const profileData = profile || user;

  const handleProfileSubmit = async (updatedData: typeof user) => {
    try {
      setError(undefined);
      await updateProfileMutation.mutateAsync(updatedData);
      updateUser(updatedData);
      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1} mb="sm">
            Settings
          </Title>
        </div>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="md">
            <Title order={2} size="h4">
              Profile Information
            </Title>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <ProfileForm
              user={profileData}
              onSubmit={handleProfileSubmit}
              isLoading={updateProfileMutation.isPending}
              error={error}
              successMessage={successMessage}
            />
          </Card.Section>
        </Card>
      </Stack>
    </Container>
  );
};

export default Settings;

