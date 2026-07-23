import { forwardRef } from "react";
import MessageBubble from "./MessageBubble";

const Conversation = forwardRef(function Conversation(
  { messages, loading, onOpenSource },
  endRef
) {
  return (
    <div className="mt-10 flex flex-1 flex-col gap-6">
      {messages.map((message, index) => (
        <MessageBubble
          key={message._id || index}
          message={message}
          onOpenSource={onOpenSource}
        />
      ))}

      {loading && (
        <MessageBubble message={{ role: "loading" }} onOpenSource={onOpenSource} />
      )}

      <div ref={endRef} />
    </div>
  );
});

export default Conversation;