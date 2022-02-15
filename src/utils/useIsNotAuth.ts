import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsNotAuth = () => {
  const [{ data }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (data?.me) {
      router.replace(`/`);
    }
  }, [data, router]);
};
