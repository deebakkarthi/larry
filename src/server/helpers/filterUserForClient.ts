import type { User } from "@clerk/nextjs/api";

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    imageUrl: user.imageUrl,
    email: user.emailAddresses.at(0)?.emailAddress ?? null,
    fullName: user.firstName + " " + user.lastName,
  };
};
