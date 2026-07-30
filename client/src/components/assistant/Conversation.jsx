import { forwardRef } from "react";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const Conversation = forwardRef(function Conversation(
  {
    messages,
    loading,
    onOpenSource,
    onRetry,
    onRegenerate,
  },
  endRef
) {
  return (
    <div
      className="
        mx-auto

        flex
        w-full
        max-w-4xl
        flex-1
        flex-col

        gap-10

        py-10
        sm:py-12
      "
    >
      {messages.map((message, index) => (
        <MessageBubble
          key={message._id || index}
          message={message}
          onOpenSource={onOpenSource}
          onRetry={onRetry}
          onRegenerate={
            message.role === "assistant"
              ? () =>
                  onRegenerate(
                    messages
                      .slice(0, index)
                      .reverse()
                      .find(
                        (item) => item.role === "user"
                      )?.content
                  )
              : undefined
          }
        />
      ))}

      {loading && (
        <div className="pt-2">
          <TypingIndicator />
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
});

export default Conversation;