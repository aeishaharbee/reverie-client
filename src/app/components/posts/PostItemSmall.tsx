import { Card, CardBody, Image } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Post } from "../users/interface";
import Link from "next/link";

interface PostItemSmallProps {
  route: string;
  post: Post;
}

export default function PostItemSmall({ route, post }: PostItemSmallProps) {
  return (
    <div className="flex w-full justify-center">
      <Card key={post._id} className="sm:w-fit w-full">
        <CardBody className="p-0 ">
          <div className="relative h-full flex justify-center ">
            <Link href={`${route}?section=${post._id}`}>
              {" "}
              <Image
                src={`http://localhost:4444/${post.images[0].image}`}
                className="object-cover w-full h-auto sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
                isZoomed
              />
            </Link>
            {post.images.length > 1 && (
              <div className="absolute top-2 right-2 z-10">
                <Icon
                  icon="bi-images"
                  className="text-white bg-purple-500 rounded-md p-1"
                  width={25}
                  height={25}
                />
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
