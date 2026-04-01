---
name: laravel-fullstack-crud
description: "Generate a full-stack CRUD for a Laravel + Inertia.js (React/TypeScript) project, including Controller, Index/Form pages, Column definitions, Route helpers, and Sidebar navigation."
---

# Laravel Full-Stack CRUD Generator

This skill automates the creation of a complete CRUD module following the "IKEO Final Project" patterns.

## 1. Backend: Controller
Create a resource controller at `app/Http/Controllers/{Model}Controller.php`.
- **Imports**: `Inertia\Inertia`, `App\Models\{Model}`, `Illuminate\Http\Request`.
- **Methods**:
    - `index`: Renders `{plural}/index` with paginated records (searchable). Passes `filters` prop.
    - `create`: Renders `{plural}/form` with any related data (e.g. categories for select dropdowns).
    - `store`: Validates and creates record. Handles file uploads to `public` disk. Auto-generates `slug` from name if applicable.
    - `edit`: Renders `{plural}/form` with found record and related data.
    - `update`: Validates and updates record. Handles optional file re-upload.
    - `destroy`: Deletes record and redirects back to index.
- All routes redirect to `{plural}.index` after store/update/destroy.

## 2. Routing
1.  **Web Routes**: Add `Route::resource('/{plural}', {Model}Controller::class)->except('show');` to `routes/web.php` inside the `dashboard` prefix group (protected by `auth` + `checkAdmin` middleware).
2.  **Route Helpers**: Run `php artisan wayfinder:generate` to generate `resources/js/routes/{plural}/index.ts`.

## 3. Frontend: TypeScript Types
Add the model interface to `resources/js/types/index.ts`:
```typescript
export interface {Model} {
  id: number;
  // ... all model fields
  created_at: string;
  updated_at: string;
}
```
Also ensure `PaginatedData<T>` generic interface exists.

## 4. Frontend: React Components
Place all components in `resources/js/pages/{plural}/`.

### `index.tsx`
- Uses `AppLayout` with `breadcrumbs`.
- Displays a `DataTable` from `@/components/data-table` with columns from `./column`.
- Includes a "Create {Model}" `Button` wrapped in `Link` pointing to `/{plural}/create`.
- Search input with `router.get` for server-side filtering (preserveState, replace).
- Pagination buttons using `categories.links` array.
- Props: `{ {plural}: PaginatedData<{Model}>; filters: { search?: string } }`.

### `form.tsx`
- Uses `useForm` from `@inertiajs/react`.
- Handles both Create and Update logic based on whether `{model}` prop exists.
- For file uploads: uses `post()` with `{ forceFormData: true }` and `_method: 'PATCH'` for updates.
- Each field has a `Label`, `Input`/`Textarea`/`Select`, and error display `{errors.field && <p className="mt-1 text-red-500">{errors.field}</p>}`.
- Image fields show current image preview when editing.
- Props: `{ {model}?: {Model}; ...relatedData }`.

### `column.tsx`
- Defines `ColumnDef<{Model}>[]` array.
- Image columns render `<img>` with `/storage/{path}` src.
- Price columns format with `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`.
- Includes an actions column with `DropdownMenu` containing:
    - **Edit**: `router.visit('/{plural}/{id}/edit')`
    - **Delete**: `router.visit('/{plural}/{id}', { method: 'delete' })`
    - **Variants** (if applicable): `router.visit('/{plural}/{id}/variants')`

## 5. Shared Components

### `data-table.tsx` (at `resources/js/components/data-table.tsx`)
- Generic `DataTable<TData, TValue>` component using `@tanstack/react-table`.
- Props: `{ columns: ColumnDef<TData, TValue>[]; data: TData[] }`.
- Renders shadcn `Table` with header groups and body rows.
- Shows "No results." when empty.

## 6. Sidebar Navigation
Add a new entry to `mainNavItems` in `resources/js/components/app-sidebar.tsx`.
```typescript
{
    title: '{Model}',
    href: '/dashboard/{plural}',
    icon: IconName,
},
```
Use appropriate lucide-react icon.

## Scaffolding Workflow
1.  Analyze the model's fields from the migration/model.
2.  Generate or verify the Controller exists at `app/Http/Controllers/`.
3.  Add or verify routes in `routes/web.php`.
4.  Run `php artisan wayfinder:generate`.
5.  Add TypeScript interface to `resources/js/types/index.ts`.
6.  Generate the React pages (`index.tsx`, `form.tsx`, `column.tsx`).
7.  Update `resources/js/components/app-sidebar.tsx`.

## File Upload Convention
- Store to `public` disk: `$request->file('image')->store('{plural}', 'public')`
- Display: `<img src={'/storage/' + path} />`
- On update: only replace file if new file is uploaded (`$request->hasFile('image')`)
- Form submission with files: `post(url, { forceFormData: true })`
- For PATCH with files: include `_method: 'PATCH'` in form data and use `post()` method.

## Route Prefix Convention
All admin CRUD routes live under `/dashboard/{plural}` prefix.
Dashboard routes use `checkAdmin` middleware to restrict access to admin users only.
