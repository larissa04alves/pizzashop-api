import chalk from "chalk";
import { db } from "./connection";
import { restaurants, users } from "./schema";
import { faker } from "@faker-js/faker";

// Resetar database
await db.delete(users);
await db.delete(restaurants);

console.log(chalk.yellow("✅ Database reset!"));

//Create customers
await db.insert(users).values([
    {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: "customer",
    },
    {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: "customer",
    },
]);

console.log(chalk.yellow("✅ Created customers!"));

//Create manager
const [manager] = await db
    .insert(users)
    .values([
        {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            role: "manager",
        },
    ])
    .returning({ id: users.id });

console.log(chalk.yellow("✅ Created manager!"));

if (!manager) {
    throw new Error("Failed to create manager");
}

//Create restaurants
await db.insert(restaurants).values([
    {
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
        managerId: manager.id,
    },
]);

console.log(chalk.yellow("✅ Created restaurants!"));

console.log(chalk.green("🎉 Seeded database successfully!"));

process.exit();
