import { useState } from "react";
import {
  Badge,
  Button,
  Container,
  Grid,
  Group,
  Image,
  NumberInput,
  Text,
  Title,
  Center,
  Stack,
  Divider,
} from "@mantine/core";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useProduct } from "../../../hooks/useProducts";
import { useAddCartItem } from "../../../hooks/useCart";
import { useAuth } from "../../../context/AuthContext";
import { Spinner } from "../../../components/ui/Spinner";

const ProductDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { data: product, isLoading, error } = useProduct(productId);
  const addToCart = useAddCartItem();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isValidProductId = !Number.isNaN(productId) && productId > 0;

  if (isLoading) {
    return (
      <Center h={400}>
        <Spinner />
      </Center>
    );
  }

  if (!isValidProductId || error || !product) {
    return (
      <Container size="lg" py="xl">
        <Text c="red" size="lg" mb="md">
          Unable to load product details. Please try again.
        </Text>
        <Button variant="outline" onClick={() => navigate("/products")}> 
          Back to Products
        </Button>
      </Container>
    );
  }

  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login", { state: { from: location }, replace: true });
      return;
    }

    setIsAdding(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await addToCart.mutateAsync({
        productId,
        quantity: Math.min(quantity, product.stock),
      });
      setQuantity(1);
      setStatusMessage("Added to cart successfully.");
    } catch (err) {
      setErrorMessage("Unable to add this product to your cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image src={product.thumbnail} alt={product.title} height={420} radius="md" />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack>
            <Stack>
              <Title order={1}>{product.title}</Title>
              <Group>
                <Badge color="blue" variant="light">
                  {product.category}
                </Badge>
                <Badge color="green" variant="light">
                  {product.brand}
                </Badge>
              </Group>
            </Stack>

            <Group align="flex-end">
              <Stack>
                <Text size="xl" fw={700}>
                  ${discountedPrice.toFixed(2)}
                </Text>
                {product.discountPercentage > 0 && (
                  <Text size="sm" c="dimmed">
                    <s>${product.price.toFixed(2)}</s> &middot; {product.discountPercentage.toFixed(0)}% off
                  </Text>
                )}
              </Stack>
              <Badge color={product.stock > 0 ? "teal" : "red"} variant="filled">
                {product.stock > 0 ? "In stock" : "Out of stock"}
              </Badge>
            </Group>

            <Stack>
              <Text size="md" c="dimmed">
                {product.description}
              </Text>
              <Divider />
              <Text size="sm">
                <strong>Rating:</strong> {product.rating.toFixed(1)} / 5
              </Text>
              <Text size="sm">
                <strong>Stock:</strong> {product.stock} available
              </Text>
            </Stack>

            {statusMessage && (
              <Text c="teal" size="sm">
                {statusMessage}
              </Text>
            )}
            {errorMessage && (
              <Text c="red" size="sm">
                {errorMessage}
              </Text>
            )}

            <Group align="flex-end">
              <NumberInput
                label="Quantity"
                value={quantity}
                onChange={(value) => setQuantity(Number(value) || 1)}
                min={1}
                max={product.stock}
                step={1}
                style={{ width: 140 }}
              />

              <Button
                size="lg"
                onClick={handleAddToCart}
                loading={isAdding}
                disabled={product.stock === 0}
              >
                {user ? "Add to Cart" : "Sign in to add"}
              </Button>

              <Button size="lg" variant="outline" onClick={() => navigate("/products")}> 
                Back to Products
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
