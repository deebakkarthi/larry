import { api } from " /utils/api";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import superjson from "superjson";
import { appRouter } from " /server/api/root";
import { db } from " /server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { PageLayout } from " /components/layout";
import Image from "next/image";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { db: db, userId: null },
    transformer: superjson,
  });
  const slug = context.params?.slug;
  if (typeof slug !== "string") {
    throw new Error("no slug");
  }
  await ssg.profile.getUserByEmail.prefetch({ email: slug });
  return { props: { trpcState: ssg.dehydrate(), email: slug } };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

const ProfilePage: NextPage<{ email: string }> = ({ email }) => {
  const { data } = api.profile.getUserByEmail.useQuery({
    email: email,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.fullName} (${data.email}) / Larry`}</title>
      </Head>
      <PageLayout>
        <div className="flex flex-col border-b border-slate-500 p-4">
          <Image
            src={data.imageUrl}
            alt={`${data.fullName}'s profile picture`}
            className="rounded-full p-4"
            width={133}
            height={133}
          />
          <div className="text-xl font-extrabold">{data.fullName}</div>
          <div className="text-sm text-slate-500">{data.email}</div>
        </div>
      </PageLayout>
    </>
  );
};

export default ProfilePage;
