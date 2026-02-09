import Elysia, { t } from "elysia";
import { db } from "../../db/connection";
import { createId } from "@paralleldrive/cuid2";
import { authLinks } from "../../db/schema";

export const sendAuthLink = new Elysia().post(
    "/authenticate",
    async ({ body }) => {
        const { email } = body;

        const userFromEmail = await db.query.users.findFirst({
            where(fields, { eq }) {
                return eq(fields.email, email);
            },
        });

        if (!userFromEmail) {
            throw new Error("User not found");
        }

        const authLinkCode = createId();

        await db.insert(authLinks).values({
            userId: userFromEmail.id,
            code: authLinkCode,
        });

        //Enviar um email

        const authLink = new URL("/auth-links/authenticate", process.env.API_BASE_URL);
        authLink.searchParams.set("code", authLinkCode);
        authLink.searchParams.set("redirect", process.env.AUTH_REDIRECT_URL ?? "");

        console.log(authLink.toString());
    },
    {
        body: t.Object({
            email: t.String(),
        }),
    },
);
