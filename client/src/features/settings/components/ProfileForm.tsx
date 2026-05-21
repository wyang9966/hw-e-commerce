import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Group,
  TextInput,
  Stack,
  Text,
  Alert,
} from "@mantine/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import type { AuthUser } from "../../../types/auth";

const profileSchema = z.object({
  username: z.string().min(1, "Username is required").readonly(),
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: AuthUser;
  onSubmit: (data: AuthUser) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  successMessage?: string;
}

export const ProfileForm = ({
  user,
  onSubmit,
  isLoading = false,
  error,
  successMessage,
}: ProfileFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username,
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
    },
  });

  const onFormSubmit = async (data: ProfileFormData) => {
    await onSubmit({
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Stack gap="md">
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert
            icon={<IconCheck size={16} />}
            color="green"
            title="Success"
          >
            {successMessage}
          </Alert>
        )}

        <TextInput
          label="Username"
          {...register("username")}
        //   disabled
          description="Your username cannot be changed"
        />

        <TextInput
          label="Email"
          placeholder="your.email@example.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <Group grow>
          <TextInput
            label="First Name"
            placeholder="John"
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <TextInput
            label="Last Name"
            placeholder="Doe"
            {...register("lastName")}
            error={errors.lastName?.message}
          />
        </Group>

        <TextInput
          label="Phone"
          placeholder="+1 (555) 123-4567"
          {...register("phone")}
          error={errors.phone?.message}
        />

        <Button type="submit" disabled={isLoading} loading={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </Stack>
    </form>
  );
};
