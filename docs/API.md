# Vellore Directory - API Documentation

## Search API

### Endpoint
```
GET /api/search
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | No* | Search query (searches name, description, category) |
| `category` | string | No* | Filter by exact category name |
| `location` | string | No* | Filter by location slug |
| `limit` | number | No | Results per page (default: 20) |
| `offset` | number | No | Pagination offset (default: 0) |

*At least one of `q`, `category`, or `location` is required.

### Response Format

```json
{
  "results": [
    {
      "id": 1,
      "name": "Business Name",
      "slug": "business-slug",
      "description": "Business description",
      "category": "Category Name",
      "address": "123 Main St",
      "pincode": "632001",
      "phone": "+91 1234567890",
      "rating": 4.5,
      ...
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### Example Requests

**Search by query:**
```bash
curl "http://localhost:3000/api/search?q=restaurant"
```

**Filter by category:**
```bash
curl "http://localhost:3000/api/search?category=Restaurants"
```

**Filter by location:**
```bash
curl "http://localhost:3000/api/search?location=kosapet"
```

**Combined filters with pagination:**
```bash
curl "http://localhost:3000/api/search?q=food&location=kosapet&limit=10&offset=0"
```

**Category + Location:**
```bash
curl "http://localhost:3000/api/search?category=Restaurants&location=gandhi-nagar"
```

### Error Responses

**400 Bad Request** - Missing required parameters:
```json
{
  "error": "At least one search parameter is required"
}
```

**500 Internal Server Error** - Server error:
```json
{
  "error": "Internal server error",
  "message": "Error details"
}
```

---

## Usage in Frontend

### React/Next.js Example

```typescript
async function searchBusinesses(query: string, page: number = 1) {
  const limit = 20;
  const offset = (page - 1) * limit;
  
  const response = await fetch(
    `/api/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
  );
  
  if (!response.ok) {
    throw new Error('Search failed');
  }
  
  return await response.json();
}

// Usage
const results = await searchBusinesses('restaurant', 1);
console.log(results.results); // Array of businesses
console.log(results.pagination.total); // Total count
```

### With Filters

```typescript
async function searchWithFilters(params: {
  query?: string;
  category?: string;
  location?: string;
  page?: number;
}) {
  const { query, category, location, page = 1 } = params;
  const limit = 20;
  const offset = (page - 1) * limit;
  
  const searchParams = new URLSearchParams();
  if (query) searchParams.set('q', query);
  if (category) searchParams.set('category', category);
  if (location) searchParams.set('location', location);
  searchParams.set('limit', limit.toString());
  searchParams.set('offset', offset.toString());
  
  const response = await fetch(`/api/search?${searchParams}`);
  return await response.json();
}

// Usage
const results = await searchWithFilters({
  query: 'restaurant',
  location: 'kosapet',
  page: 1
});
```

---

## Performance Notes

- Search queries use database indexes for optimal performance
- Results are ordered by rating (DESC) by default
- Pagination is implemented using LIMIT/OFFSET
- Response time: ~100-200ms for typical queries

---

## Future Enhancements

- [ ] Autocomplete/suggestions endpoint
- [ ] Fuzzy search for typo tolerance
- [ ] Geolocation-based distance sorting
- [ ] Advanced filters (price range, ratings, open now)
- [ ] Search analytics and trending queries
