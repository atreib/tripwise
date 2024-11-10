![](./public/icons/logo-no-background.png)

# Tripwise

Tripwise is a cutting-edge travel planning application designed to simplify your travel experience. Utilizing advanced AI algorithms, it provides personalized recommendations, budget planning, and seamless itinerary generation, making your travel effortless and enjoyable.

## Getting Started

To get started with Tripwise, follow these steps:

1. **Install Dependencies**: First, you need to install the necessary dependencies. Run the following command in your terminal:

   ```bash
   npm install
   ```

   This command will install all the packages listed in the `package.json` file, including essential libraries such as:

   - **Next.js**: A React framework for building server-side rendered applications.
   - **Next-safe-actions**: A library for handling safe server actions in Next.js applications.
   - **Kysely**: A type-safe SQL query builder for TypeScript, used to interact with our single PostgreSQL database.
   - **OpenAI**: For integrating AI capabilities into the application.
   - **Tailwind CSS**: A utility-first CSS framework for styling.

2. **Set Up Environment Variables**: Create a `.env` file in the root of your project and populate it with the necessary environment variables. You can use the provided `.env.sample` as a reference. You'll have to create an account in some third part libs (as OpenAI and Resend), but they all have free-tiers for local development. Also, you'll need a Postgres client running.

3. **Run the Development Server**: After installing the dependencies and setting up the environment variables, you can start the development server with:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action. The application leverages React Server Components (RSC) and server actions from Next.js 15 to enhance performance and user experience.
