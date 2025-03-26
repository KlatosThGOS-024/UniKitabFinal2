import { useEffect, useState } from "react";

export const AiResponse = ({ message }: { message: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    setIsTypingComplete(false);

    const interval = setInterval(() => {
      if (index < message.length) {
        setDisplayedText((prev) => prev + message[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [message]);

  return (
    <div
      suppressHydrationWarning
      className="h-fit max-w-[80%] mt-[48px] whitespace-pre-wrap bg-lightBlue2 px-5 py-3 text-base leading-10 break-words rounded-2xl bg-[#F8F5EE] text-black"
    >
      {displayedText || (isTypingComplete ? message : "...")}
    </div>
  );
};
