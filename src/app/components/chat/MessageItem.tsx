import moment from "moment";
export default function MessageItem({
  user,
  message,
  timestamp,
}: {
  user: boolean | undefined;
  message: string | undefined;
  timestamp: Date | undefined;
}) {
  return (
    <>
      <div
        className={`chat w-full mb-2  ${
          user
            ? "chat-end flex flex-col items-end"
            : "chat-start flex flex-col items-start"
        }`}
      >
        <div
          className={`chat-bubble w-fit p-2  rounded-2xl  ${
            user
              ? "chat-bubble bg-[#a7e3f2] rounded-ee-none"
              : "chat-bubble-primary bg-[#e8c3f7] rounded-es-none"
          }`}
        >
          {message}
        </div>
        <p className="text-tiny">{moment(timestamp).fromNow()}</p>
      </div>
    </>
  );
}
