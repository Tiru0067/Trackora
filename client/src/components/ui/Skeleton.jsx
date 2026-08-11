import { cn } from "@/utils/cn";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-(--line-soft)", className)}
      {...props}
    />
  );
};

export default Skeleton;
