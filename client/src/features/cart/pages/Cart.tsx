import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Group,
  Image,
  NumberInput,
  Stack,
  Table,
  Text,
  Title,
  Card,
  Badge,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useProducts } from "../../../hooks/useProducts";
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItemQuantity,
  useClearCart,
} from "../../../hooks/useCart";
import type { CartItemWithProduct } from "../../../types/cart";

const Cart = () => {
  const navigate = useNavigate();
  const { data: cart, isLoading: isCartLoading } = useCart();
  const { data: productsData } = useProducts({ limit: 1000 });
  const removeItem = useRemoveCartItem();
  const updateQuantity = useUpdateCartItemQuantity();
  const clearCart = useClearCart();
  const [isProcessing, setIsProcessing] = useState(false);

  if (isCartLoading) {
    return (
      <Container size="lg" py="xl">
        <Text>Loading cart...</Text>
      </Container>
    );
  }

  const cartItems: CartItemWithProduct[] = (cart?.items || [])
    .map((item) => {
      const product = productsData?.products.find((p) => p.id === item.productId);
      return product
        ? {
            ...item,
            product: {
              id: product.id,
              title: product.title,
              price: product.price,
              thumbnail: product.thumbnail,
              discountPercentage: product.discountPercentage,
            },
          }
        : null;
    })
    .filter((item): item is CartItemWithProduct => item !== null);

  const subtotal = cartItems.reduce((sum, item) => {
    const discountedPrice =
      item.product.price * (1 - item.product.discountPercentage / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  const handleRemoveItem = async (productId: number) => {
    setIsProcessing(true);
    try {
      await removeItem.mutateAsync(productId);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    setIsProcessing(true);
    try {
      await updateQuantity.mutateAsync({ productId, quantity: newQuantity });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCart = async () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      setIsProcessing(true);
      try {
        await clearCart.mutateAsync();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <Container size="lg" py="xl">
        <Title order={1} mb="xl">
          Shopping Cart
        </Title>
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <Text size="lg" c="dimmed">
              Your cart is empty
            </Text>
            <Button onClick={() => navigate("/products")}>
              Continue Shopping
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Shopping Cart</Title>
        <Button
          variant="subtle"
          color="red"
          onClick={handleClearCart}
          disabled={isProcessing}
        >
          Clear Cart
        </Button>
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {cartItems.map((item) => {
            const discountedPrice =
              item.product.price * (1 - item.product.discountPercentage / 100);
            const itemTotal = discountedPrice * item.quantity;

            return (
              <Table.Tr key={item.product.id}>
                <Table.Td>
                  <Group gap="sm">
                    <div>
                      <Text fw={500}>{item.product.title}</Text>
                      {item.product.discountPercentage > 0 && (
                        <Badge size="sm" color="red">
                          -{item.product.discountPercentage.toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>${discountedPrice.toFixed(2)}</Table.Td>
                <Table.Td>
                  <NumberInput
                    value={item.quantity}
                    onChange={(value) =>
                      handleUpdateQuantity(item.product.id, Number(value) || 0)
                    }
                    min={0}
                    max={100}
                    step={1}
                    disabled={isProcessing}
                    size="sm"
                    style={{ width: "70px" }}
                  />
                </Table.Td>
                <Table.Td>${itemTotal.toFixed(2)}</Table.Td>
                <Table.Td>
                  <Button
                    variant="subtle"
                    color="red"
                    size="sm"
                    leftSection={<IconTrash size={16} />}
                    onClick={() => handleRemoveItem(item.product.id)}
                    disabled={isProcessing}
                  >
                    Remove
                  </Button>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
        <Group justify="space-between">
          <Text fw={700} size="lg">
            Subtotal:
          </Text>
          <Text fw={700} size="lg">
            ${subtotal.toFixed(2)}
          </Text>
        </Group>
        <Group justify="space-between" mt="md">
          <Button variant="outline" onClick={() => navigate("/products")}>
            Continue Shopping
          </Button>
          <Button disabled={isProcessing}>Proceed to Checkout</Button>
        </Group>
      </Card>
    </Container>
  );
};

export default Cart;
