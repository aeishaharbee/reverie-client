"use client";
import { getUserByUsername, searchUser } from "@/app/api/usersApi";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useState } from "react";
import UserAvatar from "../users/UserAvatar";
import { useSelectedUser } from "@/lib/userStore";

export default function SearchFollowing() {
  const [options, setOptions] = useState<
    {
      username: string;
      fullname: string;
      _id: string;
      image?: string;
      isPremium: boolean;
    }[]
  >([]);
  const [value, setValue] = useState("");
  const setSelectedUser = useSelectedUser((state) => state.setSelectedUser);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue(query);
    if (query) {
      const data = await searchUser(query);
      setOptions(data || []);
    } else {
      setOptions([]);
    }
  };

  const handleClear = () => {
    setValue("");
    setOptions([]);
  };

  const handleRowClick = async (username: string) => {
    try {
      const user = await getUserByUsername(username);
      setSelectedUser(user);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="flex flex-col relative">
        <Input
          type="text"
          id="search"
          name="search"
          label="Search"
          value={value}
          onChange={handleSearchChange}
          isClearable
          onClear={handleClear}
          radius="lg"
          placeholder="Type to search user..."
          variant="bordered"
          startContent={
            <Icon
              icon="lucide:search"
              className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0"
            />
          }
        />
        {options.length > 0 && (
          <>
            <Table
              selectionMode="single"
              aria-label="Example static collection table"
              hideHeader
              className="absolute w-full top-full mt-2 z-50"
            >
              <TableHeader>
                <TableColumn>yolo</TableColumn>
              </TableHeader>
              <TableBody>
                {options.map((user, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleRowClick(user.username)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className="w-full">
                      <UserAvatar
                        key={user._id}
                        username={user.username}
                        fullname={user.fullname}
                        image={user.image}
                        isPremium={user.isPremium}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </>
  );
}
