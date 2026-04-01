---
name: laravel-fullstack-crud
description: "Generate a full-stack CRUD for a Laravel + Inertia.js (React/TypeScript) project, including Controller, Index/Form pages, Column definitions, Route helpers, and Sidebar navigation."
---

# Laravel Full-Stack CRUD Generator

This skill automates the creation of a complete CRUD module following the "Fullstack Bootcamp" patterns.

## 1. Backend: Controller
Create a resource controller at `app/Http/Controllers/{Model}Controller.php`.
- **Imports**: `Inertia\Inertia`, `App\Models\{Model}`, `Illuminate\Http\Request`.
- **Methods**:
    - `index`: Renders `{plural}/index` with all records.
    - `create`: Renders `{plural}/form` with `null` model.
    - `store`: Validates and creates record.
    - `edit`: Renders `{plural}/form` with found record.
    - `update`: Validates and updates record.
    - `destroy`: Deletes record.

## 2. Routing
1.  **Web Routes**: Add `Route::resource('/{plural}', {Model}Controller::class);` to `routes/web.php` inside the auth/admin middleware group.
2.  **Route Helpers**: Run `php artisan wayfinder:generate` to generate `resources/js/routes/{plural}/index.ts`.

## 3. Frontend: React Components
Place all components in `resources/js/pages/{plural}/`.

### `index.tsx`
- Displays a `DataTable` from `@/components/data-table`.
- Includes a "Create {Model}" button linking to `routes.{plural}.create()`.
- Uses `breadcrumbs` array for navigation.

### `form.tsx`
- Uses `useForm` from `@inertiajs/react`.
- Handles both Create and Update logic.
- Displays form fields (Name is default; add others as per model).
- Includes validation error display using `InputError`.

### `column.tsx`
- Defines `ColumnDef` for the model.
- Includes an `ActionsCell` component with:
    - **Edit**: Navigates to edit route.
    - **Delete**: Triggers an `AlertDialog` and uses `router.delete` on confirm.

## 4. Sidebar Navigation
Add a new entry to `mainNavItems` in `resources/js/components/app-sidebar.tsx`.
Example:
```typescript
{
    title: '{Model}',
    href: {plural}.index().url,
    icon: LayoutGrid, // Or appropriate icon
},
```

## Scaffolding Workflow
1.  Analyze the model's fields.
2.  Generate the Controller.
3.  Add routes to `web.php`.
4.  Run `php artisan wayfinder:generate`.
5.  Generate the React pages (`index.tsx`, `form.tsx`, `column.tsx`).
6.  Update the `app-sidebar.tsx`.
