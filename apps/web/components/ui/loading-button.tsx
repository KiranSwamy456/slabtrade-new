import { Button } from "@/components/ui/button";

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
  loadingText?: React.ReactNode;
}

export function LoadingButton({
  loading = false,
  loadingText,
  disabled,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
