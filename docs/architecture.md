# Architecture

> Data flow patterns, state management strategy, and architectural decisions for Lasu Financial.

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Expo Router                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  (auth)  │  │  (tabs)  │  │  modals  │  │ deep link│    │
│  │  stack   │  │  layout  │  │          │  │  routes  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                  Provider Layer                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │ QueryProvider  │  │  ThemeProvider  │  │  SafeArea      │  │
│  │ (TanStack)     │  │  (Expo)        │  │  (Expo)        │  │
│  └────────────────┘  └────────────────┘  └────────────────┘  │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    State Layer                                │
│                                                               │
│  Server State (TanStack Query)   Client State (Zustand)       │
│  ┌────────────────────────┐      ┌──────────────────────┐    │
│  │ queries/  → useQuery   │      │ auth-store (MMKV)    │    │
│  │ mutations/→ useMutation│      │ app-store  (MMKV)    │    │
│  └──────────┬─────────────┘      └───────────┬──────────┘    │
│             │                                │               │
│     ┌───────▼───────┐               ┌────────▼─────────┐    │
│     │ Zod Schemas   │               │ MMKV Storage     │    │
│     │ (validation)  │               │ (persistence)    │    │
│     └───────────────┘               └──────────────────┘    │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                  Service Layer (lib/)                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐  │
│  │ supabase   │  │  axios     │  │ storage (MMKV)         │  │
│  │ (DB/Auth)  │  │ (External) │  │ adapters for Zustand   │  │
│  └────────────┘  └────────────┘  │ and Supabase auth      │  │
│                                   └────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## State Management Strategy

### 1. Server State — TanStack Query

**When to use:** Any data that originates from Supabase, external APIs, or any remote source.

**Why:** Automatic caching, deduplication, background refetching, optimistic updates, and retry logic out of the box.

```
hooks/
├── queries/                    # Read operations
│   ├── index.ts                # Query key factories
│   └── use-instruments.ts      # Example: fetch instrument list
└── mutations/                  # Write operations
    └── index.ts                # Mutation hooks
```

#### Query Key Factory Pattern

```typescript
// All keys for a domain live together
export const instrumentKeys = {
  all: ['instruments'] as const,
  lists: () => [...instrumentKeys.all, 'list'] as const,
  list: (filters: InstrumentFilters) => [...instrumentKeys.lists(), filters] as const,
  details: () => [...instrumentKeys.all, 'detail'] as const,
  detail: (id: string) => [...instrumentKeys.details(), id] as const,
};
```

This pattern enables precise cache invalidation:

```typescript
// Invalidate all instrument queries
queryClient.invalidateQueries({ queryKey: instrumentKeys.all });

// Invalidate only the instrument list
queryClient.invalidateQueries({ queryKey: instrumentKeys.lists() });
```

#### Zod Validation on Fetch

Every query function validates API responses through Zod schemas before returning data. This catches backend contract changes at runtime:

```typescript
async function fetchInstruments(): Promise<Instrument[]> {
  const { data, error } = await supabase.from('instruments').select('*');
  if (error) throw error;
  return instrumentListSchema.parse(data); // Runtime validation
}
```

### 2. Client State — Zustand

**When to use:** App-level state not tied to a remote data source — user preferences, UI state shared across screens, auth session info.

**Why:** Minimal boilerplate, no providers needed, built-in persistence via MMKV adapter.

```
stores/
├── auth-store.ts   # { isAuthenticated, userId, email, session actions }
└── app-store.ts    # { themeMode, hasCompletedOnboarding, preferences }
```

#### Persistence Flow

```
Component ←→ Zustand Store ←→ zustandStorage adapter ←→ MMKV (disk)
```

The `zustandStorage` adapter in `lib/storage.ts` translates Zustand's persistence interface to MMKV's synchronous API. Data is serialized as JSON and written to disk immediately (synchronous, no async overhead).

### 3. Local State — React `useState`

**When to use:** State that belongs to a single component or a small subtree and doesn't need to survive navigation.

```typescript
const [isExpanded, setIsExpanded] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
```

---

## Data Flow Patterns

### Read Flow (Query)

```
Screen mounts
  → useInstruments() hook called
  → TanStack Query checks cache
    → Cache HIT (fresh) → Return cached data immediately
    → Cache MISS or STALE →
        → fetchInstruments() called
        → Supabase client makes request
        → Response validated with Zod schema
        → Data cached for 5 minutes (staleTime)
        → Garbage collected after 30 minutes (gcTime)
        → Component re-renders with data
```

### Write Flow (Mutation)

```
User submits form
  → TanStack Form validates with Zod
  → useMutation hook called
  → Optimistic update (optional)
  → Supabase client makes INSERT/UPDATE/DELETE
  → On success:
    → Invalidate related queries
    → Toast notification
    → Navigate (if needed)
  → On error:
    → Rollback optimistic update
    → Show error to user
```

### Auth Flow

```
App launches
  → AuthStore hydrates from MMKV
  → Check Supabase session
    → Valid session → Navigate to (tabs)
    → No session → Navigate to (auth)
  → On login:
    → Supabase auth.signIn()
    → AuthStore.setSession()
    → Persisted to MMKV
    → Navigate to (tabs)
  → On logout:
    → Supabase auth.signOut()
    → AuthStore.clearSession()
    → Clear MMKV auth data
    → queryClient.clear()
    → Navigate to (auth)
```

---

## Network & Focus Management

The `QueryProvider` sets up platform-specific online/focus tracking:

- **Online Manager**: Uses `expo-network` to detect connectivity changes. Queries pause when offline and resume when connection is restored.
- **Focus Manager**: Uses React Native's `AppState` to detect when the app returns to the foreground. Stale queries automatically refetch when the user switches back to the app.

---

## Module Boundaries

| Module        | Can Import From                                                                |
| ------------- | ------------------------------------------------------------------------------ |
| `app/`        | `components/`, `hooks/`, `lib/`, `stores/`, `schemas/`, `utils/`, `constants/` |
| `components/` | `hooks/`, `constants/`, `utils/`                                               |
| `hooks/`      | `lib/`, `schemas/`, `stores/`                                                  |
| `lib/`        | (external packages only)                                                       |
| `stores/`     | `lib/storage`                                                                  |
| `schemas/`    | (zod only — no app imports)                                                    |
| `utils/`      | (pure functions — no React imports)                                            |
| `providers/`  | `lib/`                                                                         |

Schemas are the **single source of truth** for data shapes. Both TanStack Query hooks and Supabase queries reference the same Zod schemas, ensuring frontend types always match validated server data.
