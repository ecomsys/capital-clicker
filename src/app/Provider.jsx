// src/app/Provider.jsx
import { useEffect } from "react";
import { AppRouter } from "@/app/Router";
import { initViewport } from "@/lib/viewport";
import { initAutoRem } from "@/lib/auto-rem";
import Modal from "@/components/basic/Modal";
import useModalStore from "@/stores/useModalStore";

export function AppProvider() {
  const { classes } = useModalStore();

  useEffect(() => {
    const cleanupAutoREM = initAutoRem(1980, 16);
    const cleanupViewport = initViewport(1536, 1980);

    return () => {
      cleanupAutoREM();
      cleanupViewport();
    };
  }, []);

  return (
    <>
      <AppRouter />
      <Modal className={classes} />
    </>
  );
}

export default AppProvider;
