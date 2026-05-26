import { useMemo } from 'react';
import {
  Box,
  Container,
  Text,
  Title,
  SimpleGrid,
  Card,
  Image,
  Badge,
  Group,
  Rating,
  Stack,
  Center,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useProducts, useCategories } from '../../../hooks/useProducts';
import { useProductFilters } from '../../../hooks/useProductFilters';
import { ProductSidebarFilters } from '../components/ProductSidebarFilters';
import { Spinner } from '../../../components/ui/Spinner';

const Products = () => {
  const navigate = useNavigate();
  const { filters, setFilters, clearFilters } = useProductFilters();
  const { data, isLoading, error } = useProducts({ category: filters.category });
  const categoriesQuery = useCategories();

  const filteredProducts = useMemo(() => {
    if (!data?.products) {
      return [];
    }

    return data.products.filter((product) => {
      const matchesPrice =
        product.price >= filters.minPrice && product.price <= filters.maxPrice;
      const matchesRating =
        filters.rating === undefined || product.rating >= filters.rating;
      const matchesDeals =
        !filters.deals || product.discountPercentage > 0;

      return matchesPrice && matchesRating && matchesDeals;
    });
  }, [data?.products, filters.minPrice, filters.maxPrice, filters.rating, filters.deals]);

  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];

    switch (filters.sort) {
      case 'price_asc':
        return products.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return products.sort((a, b) => b.price - a.price);
      case 'rating_desc':
        return products.sort((a, b) => b.rating - a.rating);
      case 'discount_desc':
        return products.sort((a, b) => b.discountPercentage - a.discountPercentage);
      default:
        return products;
    }
  }, [filteredProducts, filters.sort]);

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
        {filters.category ? `Products in ${filters.category}` : 'Our Products'}
      </Title>

      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 320px) 1fr',
          gap: 24,
        }}
      >
        <Box>
          <ProductSidebarFilters
            categories={categoriesQuery.data ?? []}
            filters={filters}
            setFilters={setFilters}
            clearFilters={clearFilters}
          />
        </Box>

        <Box>
          {sortedProducts.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
              {sortedProducts.map((product) => (
                <Card
                  key={product.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  onClick={() => navigate(`/products/${product.id}`)}
                  style={{ cursor: 'pointer' }}
                >
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
            <Text size="lg">No products match your filters.</Text>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Products;
