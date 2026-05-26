import { Avatar, Button, Group, Indicator, Menu, Text } from "@mantine/core";
import {
  IconChevronDown,
  IconLogin,
  IconLogout,
  IconSettings,
  IconShoppingCart,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { SearchBar } from "./SearchBar";
import { ThemeToggler } from "./ThemeToggler";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../hooks/useCart";

export const Navbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const { data: cart } = useCart();

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const userDisplayName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : user?.username;
  // const userSubTitle = user?.email ?? user?.username;
  const userSubTitle = "Premium Member"; 

  const handleLogout = () => {
    logout();
    queryClient.setQueryData(["cart"], { items: [] });
    navigate("/login");
  };

  return (
    <Group
      justify="space-between"
      p="md"
      style={{ borderBottom: "1px solid #e9ecef" }}
    >
      <Text
        size="xl"
        fw={700}
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        E-Commerce Store
      </Text>

      <SearchBar />

      <Group>
        <ThemeToggler />
        <Indicator label={cartItemCount} size={16} color="red" position="middle-start">
          <Button
            variant="subtle"
            leftSection={<IconShoppingCart size={18} />}
            onClick={() => navigate("/cart")}
          >
            Cart
          </Button>
        </Indicator>

        {user ? (
          <Menu shadow="md" width={240}>
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<IconChevronDown size={16} />}
              >
                <Group gap="xs">
                  <Avatar src="" alt={userDisplayName} size="sm" />
                  <div>
                    <Text size="sm">{userDisplayName}</Text>
                    <Text size="xs" c="dimmed">
                      {userSubTitle}
                    </Text>
                  </div>
                </Group>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Signed in as {userDisplayName}</Menu.Label>
              <Menu.Item
                leftSection={<IconSettings size={16} />}
                onClick={() => navigate("/settings")}
              >
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconLogout size={16} />}
                color="red"
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Button
            variant="subtle"
            leftSection={<IconLogin size={18} />}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        )}
      </Group>
    </Group>
  );
};
