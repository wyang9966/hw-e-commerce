import { Container, Text, Title, SimpleGrid, Card, Image, Badge, Group, Rating, Stack, Loader, Center } from '@mantine/core';
import { useProducts } from '../../../hooks/useProducts';
import { Spinner } from '../../../components/ui/Spinner';
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useProducts({});

  if (isLoading) {
    return (
      <Center h={400}>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Text c="red" size="lg">
          Failed to load products. Please try again later.
        </Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Our Products
      </Title>
      {data?.products && data.products.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
          {data.products.map((product) => (
            <Card key={product.id} shadow="sm" padding="lg" radius="md" withBorder onClick={() => navigate(`/products/${product.id}`)} style={{ cursor: 'pointer' }}>
              <Card.Section>
                <Image src={product.thumbnail} height={200} alt={product.title} />
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500} lineClamp={1}>
                  {product.title}
                </Text>
                <Badge color="blue" variant="light">
                  {product.category}
                </Badge>
              </Group>

              <Text size="sm" c="dimmed" lineClamp={2}>
                {product.description}
              </Text>

              <Stack gap="xs" mt="md">
                <Group justify="space-between">
                  <Text fw={700} size="lg">
                    ${product.price.toFixed(2)}
                  </Text>
                  {product.discountPercentage > 0 && (
                    <Badge color="red" variant="light">
                      -{product.discountPercentage.toFixed(1)}%
                    </Badge>
                  )}
                </Group>

                <Group justify="space-between">
                  <Rating value={product.rating} readOnly size="sm" />
                  <Text size="xs" c="dimmed">
                    Stock: {product.stock}
                  </Text>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Text size="lg">No products available</Text>
      )}
    </Container>
  );
};

export default Products;
