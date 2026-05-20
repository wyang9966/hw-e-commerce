import {
  Badge,
  Button,
  Container,
  Grid,
  Group,
  Image,
  Text,
  Title,
  Center,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../../hooks/useProducts";
import { Spinner } from "../../../components/ui/Spinner";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <Center h={400}>
        <Spinner />
      </Center>
    );
  }

  if (error || !product) {
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

  return (
    <Container size="lg" py="xl">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image src={product.thumbnail} alt={product.title} height={400} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Title order={1} mb="md">
            {product.title}
          </Title>
          <Group mb="md">
            <Badge size="lg" color="pink">
              ${ (product.price - (product.price * product.discountPercentage) / 100).toFixed(2) }
            </Badge>
            <Badge size="lg" color="blue">
              {product.category}
            </Badge>
          </Group>
          <Text size="lg" mb="md">
            {product.description}
          </Text>
          <Text size="md" mb="xl" c="dimmed">
            Stock: {product.stock} units available
          </Text>
          <Group>
            <Button size="lg">Add to Cart</Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/products")}> 
              Back to Products
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
