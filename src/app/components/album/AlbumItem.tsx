import { Card, CardBody, Image } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Album } from "../users/interface";
import Link from "next/link";

interface AlbumItemProps {
  album: Album;
}

export default function AlbumItem({ album }: AlbumItemProps) {
  return (
    <div className="flex w-full justify-center">
      <Link href={`/album/${album._id}`}>
        <Card key={album._id} className="sm:w-fit w-full">
          <CardBody className="p-0 ">
            <div className="relative h-full flex justify-center group">
              <Image
                src={`http://localhost:4444/${album.image}`}
                className="object-cover w-full h-auto sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 hover:blur-sm"
                isZoomed
              />
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-opacity-30 bg-white group-hover:bg-opacity-60 transition-all">
                <p className="text-2xl font-semibold transition-all group-hover:text-3xl">
                  {album.name}
                </p>
              </div>
              <div className="absolute top-2 right-2 z-20 flex gap-1 items-center justify-center">
                <p className="font-bold ">{album.posts.length}</p>
                <Icon
                  icon="bi:file-earmark-post-fill"
                  className="text-purple-500 "
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </Link>
    </div>
  );
}
