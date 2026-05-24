import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useCategories, useProducts } from "../../../hooks/useProducts";
import HomeInfoSection from "../../../components/home/HomeInfoSection";
import type { Product, Category } from "../../../types/product";

const Home = () => {
  const navigate = useNavigate();
  const productsQuery = useProducts({ limit: 8 });
  const categoriesQuery = useCategories();

  const featuredProducts = productsQuery.data?.products
    ? [...productsQuery.data.products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4)
    : [];

  const categories = categoriesQuery.data ?? [];

  return (
    <Container size="xl" py="xl">
      <HeroSection onBrowse={() => navigate("/products")} />

      <Box mt="xl">
        <SectionHeading title="Featured Products" description="Handpicked favorites from our newest arrivals." />
        <FeaturedGrid
          isLoading={productsQuery.isLoading}
          products={featuredProducts}
          onSelect={(id) => navigate(`/products/${id}`)}
        />
      </Box>
      <HomeInfoSection />
    </Container>
  );
};

const HeroSection = ({ onBrowse }: { onBrowse: () => void }) => {
  return (
    <Button size="lg" radius="md" onClick={onBrowse}>
      Browse Products
    </Button>
  );
};

const SectionHeading = ({ title, description }: { title: string; description: string }) => (
  <Box mb="md">
    <Title order={2} mb="xs">
      {title}
    </Title>
    <Text c="dimmed">{description}</Text>
  </Box>
);

const FeaturedGrid = ({
  isLoading,
  products,
  onSelect,
}: {
  isLoading: boolean;
  products: Product[];
  onSelect: (id: number) => void;
}) => {
  if (isLoading) {
    return <Text c="dimmed">Loading featured products...</Text>;
  }

  if (!products.length) {
    return <Text c="dimmed">No featured products available right now.</Text>;
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
      {products.map((product) => (
        <Card
          key={product.id}
          shadow="sm"
          radius="md"
          withBorder
          style={{ cursor: "pointer", height: "100%" }}
          onClick={() => onSelect(product.id)}
        >
          <Card.Section>
            <Image src={product.thumbnail} height={180} alt={product.title} />
          </Card.Section>

          <Group>
            <Text fw={700} lineClamp={1}>
              {product.title}
            </Text>
            <Badge color="blue" variant="light">
              {product.category}
            </Badge>
          </Group>

          <Group>
            <Text fw={700} size="lg">
              ${product.price.toFixed(2)}
            </Text>
            <Text size="xs" c="dimmed">
              Stock: {product.stock}
            </Text>
            <Badge size="sm" color="red">
              {product.discountPercentage.toFixed(0)}%
            </Badge>
            <Badge color="teal" variant="outline">
              {product.rating.toFixed(1)} ⭐
            </Badge>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
};

const CategoryGrid = ({
  isLoading,
  categories,
  onSelect,
}: {
  isLoading: boolean;
  categories: Category[];
  onSelect: (slug: string) => void;
}) => {
  if (isLoading) {
    return <Text c="dimmed">Loading categories...</Text>;
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, xl: 4 }} spacing="lg">
      {categories.map((category) => (
        <Card
          key={category.slug}
          shadow="sm"
          radius="md"
          withBorder
          p="xl"
          style={{ cursor: "pointer", minHeight: 180 }}
          onClick={() => onSelect(category.slug)}
        >
          <Stack>
            <Box>
              <Text size="xs" tt="uppercase" c="blue" fw={700} mb="xs">
                Category
              </Text>
              <Title order={4}>{category.name}</Title>
            </Box>
            <Text c="dimmed" size="sm">
              Explore curated picks and best-selling items in the {category.name} collection.
            </Text>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
};

export default Home;
