export const UserResponse = ({ message }: { message: string }) => {
  return (
    <div
      className="whitespace-pre-wrap rounded-2xl 
    text-base px-8 py-5 max-w-[50%] break-words 
    bg-[#F8F5EE] text-black"
    >
      {message}
    </div>
  );
};
