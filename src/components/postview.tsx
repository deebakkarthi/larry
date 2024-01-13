import type { RouterOutputs } from " /utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["post"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-500 p-4">
      <Link
        href={`/${author.email}`}
        className="h-10 w-10 flex-shrink-0 flex-grow-0"
      >
        <Image
          src={author.imageUrl}
          className="rounded-full"
          alt={`${author.fullName}'s profile picture`}
          width={40}
          height={40}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex">
          <Link href={`/${author.email}`}>
            <span className="font-semibold text-white">{author.fullName}</span>
          </Link>
          <Link href={`/${author.email}`}>
            <span className="ps-1 text-slate-400">{author.email}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="ps-1 text-slate-400">{`· ${dayjs(
              post.createdAt,
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};
