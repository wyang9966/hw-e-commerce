import {
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  NumberInput,
  RangeSlider,
  Select,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import type { Category } from '../../../types/product';
import type { ProductFilters } from '../../../hooks/useProductFilters';

const RATINGS = [4, 3, 2, 1];

interface ProductSidebarFiltersProps {
  categories: Category[];
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
}

export const ProductSidebarFilters = ({
  categories,
  filters,
  setFilters,
  clearFilters,
}: ProductSidebarFiltersProps) => {
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((category) => ({
      value: category.slug,
      label: category.name,
    })),
  ];

  return (
    <Stack gap="md">
      <Box p="md" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <Stack gap="xl">
          <Stack gap="sm">
            <Title order={3}>Filters</Title>
          </Stack>

          <Stack gap="sm">
            <Text fw={600} size="sm">
              Category
            </Text>
            <Select
              data={categoryOptions}
              placeholder="All Categories"
              searchable
              clearable
              value={filters.category ?? ''}
              onChange={(value) =>
                setFilters({ category: value ? value : undefined })
              }
            />
          </Stack>

          <Divider />

          <Stack gap="sm">
            <Text fw={600} size="sm">
              Price Range
            </Text>
            <RangeSlider
              min={0}
              max={2000}
              step={50}
              value={[filters.minPrice, filters.maxPrice]}
              marks={[
                { value: 0, label: '$0' },
                { value: 2000, label: '$2000' },
              ]}
              mb="md"
              onChange={([min, max]) =>
                setFilters({ minPrice: min, maxPrice: max })
              }
            />
            <Group grow>
              <NumberInput
                label="Min"
                value={filters.minPrice}
                min={0}
                max={filters.maxPrice}
                prefix="$"
                onChange={(value) =>
                  typeof value === 'number' &&
                  setFilters({
                    minPrice: Math.min(Math.max(value, 0), filters.maxPrice),
                  })
                }
              />
              <NumberInput
                label="Max"
                value={filters.maxPrice}
                min={filters.minPrice}
                max={2000}
                prefix="$"
                onChange={(value) =>
                  typeof value === 'number' &&
                  setFilters({
                    maxPrice: Math.max(Math.min(value, 2000), filters.minPrice),
                  })
                }
              />
            </Group>
          </Stack>

          <Divider />

          <Stack gap="sm">
            <Text fw={600} size="sm">
              Rating
            </Text>
            <Stack gap="xs">
              {RATINGS.map((rating) => {
                const checked = filters.rating === rating;
                return (
                  <Group key={rating} align="center" gap="xs">
                    <Checkbox
                      checked={checked}
                      onChange={() =>
                        setFilters({ rating: checked ? undefined : rating })
                      }
                    />
                    <Group gap={2}>
                      {[...Array(rating)].map((_, i) => (
                        <IconStarFilled key={`filled-${i}`} size={16} color="#ffd43b" />
                      ))}
                      {[...Array(5 - rating)].map((_, i) => (
                        <IconStar key={`empty-${i}`} size={16} color="#868e96" />
                      ))}
                    </Group>
                    <Text size="sm">& up</Text>
                  </Group>
                );
              })}
            </Stack>
          </Stack>

          <Divider />

          <Stack gap="sm">
            <Text fw={600} size="sm">
              Deals
            </Text>
            <Switch
              label="On Sale / Discounted"
              checked={filters.deals}
              onChange={(event) =>
                setFilters({ deals: event.currentTarget.checked })
              }
            />
          </Stack>

          <Divider />

          <Stack gap="sm">
            <Text fw={600} size="sm">
              Sort By
            </Text>
            <Select
              data={[
                { value: '', label: 'Default' },
                { value: 'price_asc', label: 'Price: Low to High' },
                { value: 'price_desc', label: 'Price: High to Low' },
                { value: 'rating_desc', label: 'Rating: High to Low' },
                { value: 'discount_desc', label: 'Discount: High to Low' },
              ]}
              value={filters.sort ?? ''}
              onChange={(value) =>
                setFilters({ sort: value ? (value as ProductFilters['sort']) : undefined })
              }
            />
          </Stack>

          <Button variant="outline" fullWidth onClick={clearFilters} mt="md">
            Reset Filters
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};
