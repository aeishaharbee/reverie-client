import { Icon } from "@iconify/react/dist/iconify.js";
import { User, Link } from "@nextui-org/react";

interface UserAvatarProps {
  username: string;
  fullname?: string;
  image?: string;
  isPremium: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  username,
  fullname,
  image,
  isPremium,
}) => {
  return (
    <User
      name={
        isPremium ? (
          <div className="flex items-center gap-1">
            {fullname || username}{" "}
            <Icon icon="bi:patch-check-fill" color="#9353D3" />
          </div>
        ) : (
          fullname || username
        )
      }
      description={
        <Link href={`/users/${username}`} size="sm">
          @{username}
        </Link>
      }
      avatarProps={{
        isBordered: true,
        src: image
          ? `http://localhost:4444/${image}`
          : `http://localhost:4444/default-pfp.png`,
        color: isPremium ? "secondary" : "default",
      }}
    />
  );
};

export default UserAvatar;
