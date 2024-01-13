import { api } from " /utils/api";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import superjson from "superjson";
import { appRouter } from " /server/api/root";
import { db } from " /server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { PageLayout } from " /components/layout";
import Image from "next/image";
import { LoadingPage } from " /components/loading";
import { PostView } from " /components/postview";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.post.getPostsByUserId.useQuery({
    userId: props.userId,
  });
  if (isLoading) return <LoadingPage />;
  if (!data || data.length === 0) return <div> No posts</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
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
        <div className="relative h-36  bg-slate-500">
          <Image
            src={data.imageUrl}
            alt={`${data.fullName}'s profile picture`}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black"
            width={128}
            height={128}
          />
        </div>
        <div className="h-[64px]" />
        <div className="px-4 text-xl font-extrabold">{data.fullName}</div>
        <div className="px-4 pb-4 text-sm text-slate-500">{data.email}</div>
        <div className="w-full border-b border-slate-500" />
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

export default ProfilePage;

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
