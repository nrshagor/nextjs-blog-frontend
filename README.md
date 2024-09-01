# **Blog Platform - Frontend**

## **Introduction**

This is the frontend of the blog platform, built using Next.js. The frontend provides an interface for users to interact with the blog platform, allowing them to register, login, create posts, comment on posts, and manage their content. The frontend communicates with the Laravel backend via a RESTful API.

## **Setup**

### **Prerequisites**

- Node.js 14
- npm or yarn

### **Steps**

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/nrshagor/nextjs-blog-frontend.git
   cd blog-platform-frontend
   ```

Install Dependencies:

```bash
npm install
#or
yarn install
```

3. Environment Configuration:

- Create a .env.local file with the following content:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The frontend will be available at http://localhost:3000.

## **Features**

### User Authentication

- Register: Users can create a new account.
- Login: Users can log in to access the platform’s features.
- Logout: Users can log out, and their authentication tokens will be cleared.

## Dashboard

- Manage Posts: Users can create, edit, view, and delete their own blog posts.
- Manage Comments: Users can comment on posts, edit their comments, or delete them.

## Blog Posts

- View Posts: All users can view the list of blog posts.
- Create Posts: Authenticated users can create new posts.
- Edit/Delete Posts: Users can manage their posts via the dashboard.

## Comments

- View/Add Comments: Users can view and add comments on any post.
- Edit/Delete Comments: Authenticated users can manage their comments.

## **API Integration**

- Axios: The frontend uses axios for making HTTP requests to the backend API.
- Token Storage: Authentication tokens are stored in cookies for secure access to protected routes.

## Styling

- Tailwind CSS: The project uses Tailwind CSS for responsive and customizable styling.
- NextUI (Optional): NextUI components are used for UI elements where needed.

## Production

- Build the Application:

```bash
npm run build
#or
yarn build
```

## Authors

- [@nrshagor](https://github.com/nrshagor)
