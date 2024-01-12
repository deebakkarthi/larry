import { z } from "zod";

import { createTRPCRouter, publicProcedure } from " /server/api/trpc";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from " /server/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        emailAddress: [input.email],
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      const filteredUser = filterUserForClient(user);

      if (!filteredUser.email) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User email not found",
        });
      }
      return { ...filteredUser, email: filteredUser.email };
    }),
});
