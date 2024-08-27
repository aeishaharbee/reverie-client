import { ScrollShadow } from "@nextui-org/react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import TopBar from "./TopBar";
import { useSelectedUser } from "@/lib/userStore";

export default function Messages() {
  const selectedUser = useSelectedUser((state) => state.selectedUser);

  return (
    <>
      <div className="hidden messages w-full flex-col border-3 rounded-lg">
        <TopBar selectedUser={selectedUser} />
        <div
          // max-w-sm lg:max-w-3xl w-fit
          className={`p-3 lex flex-col justify-between w-full mx-auto  ${
            selectedUser ? "" : "lg:hidden"
          }`}
        >
          <ScrollShadow className="w-full h-[80vh] pb-5" hideScrollBar>
            <MessageList />
          </ScrollShadow>
          <MessageInput />
        </div>
      </div>
    </>
  );
}
