import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Snackbar, Alert, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

type Severity = "success" | "error" | "info" | "warning";

type NotifyItem = {
  id: number;
  message: string;
  severity: Severity;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
};

type NotifyFn = (message: string, options?: Partial<Omit<NotifyItem,"id"|"message">>) => void;

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  severity?: Severity;
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

type Ctx = {
  notify: NotifyFn;
  success: (m: string, opts?: Partial<Omit<NotifyItem,"id"|"message">>) => void;
  error: (m: string, opts?: Partial<Omit<NotifyItem,"id"|"message">>) => void;
  info: (m: string, opts?: Partial<Omit<NotifyItem,"id"|"message">>) => void;
  warning: (m: string, opts?: Partial<Omit<NotifyItem,"id"|"message">>) => void;
  confirm: ConfirmFn;
};

const NotificationsContext = createContext<Ctx | undefined>(undefined);

let globalId = 1;

export const NotificationsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [queue, setQueue] = useState<NotifyItem[]>([]);
  const [current, setCurrent] = useState<NotifyItem | null>(null);
  const [open, setOpen] = useState(false);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const confirmResolveRef = useRef<(value: boolean) => void>();
  const [confirmOpts, setConfirmOpts] = useState<Required<ConfirmOptions>>({
    title: "¿Confirmar acción?",
    description: "Esta acción no se puede deshacer.",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    severity: "warning",
  });

  const processQueue = useCallback(() => {
    if (current || queue.length === 0) return;
    const next = queue[0];
    setCurrent(next);
    setOpen(true);
  }, [current, queue]);

  const handleClose = useCallback((_e?: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  }, []);

  const handleExited = useCallback(() => {
    setCurrent(null);
    setQueue((prev) => prev.slice(1));
  }, []);

  const push = useCallback<NotifyFn>((message, options) => {
    const item: NotifyItem = {
      id: globalId++,
      message,
      severity: options?.severity ?? "info",
      duration: options?.duration ?? 3000,
      actionLabel: options?.actionLabel,
      onAction: options?.onAction,
    };
    setQueue((prev) => [...prev, item]);
  }, []);

  const success = useCallback<Ctx["success"]>((m, o) => push(m, { ...o, severity: "success" }), [push]);
  const error = useCallback<Ctx["error"]>((m, o) => push(m, { ...o, severity: "error" }), [push]);
  const info = useCallback<Ctx["info"]>((m, o) => push(m, { ...o, severity: "info" }), [push]);
  const warning = useCallback<Ctx["warning"]>((m, o) => push(m, { ...o, severity: "warning" }), [push]);

  const confirm = useCallback<ConfirmFn>((opts) => {
    setConfirmOpts({
      title: opts.title ?? "¿Confirmar acción?",
      description: opts.description ?? "Esta acción no se puede deshacer.",
      confirmText: opts.confirmText ?? "Confirmar",
      cancelText: opts.cancelText ?? "Cancelar",
      severity: opts.severity ?? "warning",
    });
    setConfirmOpen(true);
    return new Promise<boolean>((resolve) => {
      confirmResolveRef.current = resolve;
    });
  }, []);

  const ctxValue: Ctx = useMemo(() => ({
    notify: push,
    success,
    error,
    info,
    warning,
    confirm,
  }), [push, success, error, info, warning, confirm]);

  React.useEffect(() => {
    if (!current) processQueue();
  }, [queue, current, processQueue]);

  return (
    <NotificationsContext.Provider value={ctxValue}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={current?.duration}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleClose}
          severity={current?.severity}
          sx={{ width: "100%" }}
          action={current?.actionLabel ? (
            <Button size="small" onClick={() => current?.onAction?.()}>
              {current?.actionLabel}
            </Button>
          ) : undefined}
        >
          {current?.message}
        </Alert>
      </Snackbar>

      <Dialog open={confirmOpen} onClose={() => { setConfirmOpen(false); confirmResolveRef.current?.(false); }}>
        <DialogTitle>{confirmOpts.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmOpts.description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setConfirmOpen(false); confirmResolveRef.current?.(false); }}>
            {confirmOpts.cancelText}
          </Button>
          <Button
            color={confirmOpts.severity === "warning" ? "warning" : "primary"}
            variant="contained"
            onClick={() => { setConfirmOpen(false); confirmResolveRef.current?.(true); }}
          >
            {confirmOpts.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </NotificationsContext.Provider>
  );
};

export const useNotify = (): Ctx => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotify must be used within <NotificationsProvider>");
  return ctx;
};
