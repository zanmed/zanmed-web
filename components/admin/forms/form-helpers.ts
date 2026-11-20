"use client";

import { startTransition, useEffect, useRef, type FormEvent } from "react";
import type { ActionState } from "@/lib/utils";

export function submitAction(
  event: FormEvent<HTMLFormElement>,
  formAction: (formData: FormData) => void,
  prepare?: (formData: FormData) => void,
) {
  event.preventDefault();
  const submitter = (event.nativeEvent as SubmitEvent)
    .submitter as HTMLElement | null;
  const formData = new FormData(event.currentTarget, submitter);
  prepare?.(formData);
  startTransition(() => formAction(formData));
}

export function useActionSuccess(state: ActionState, onSuccess?: () => void) {
  const callback = useRef(onSuccess);

  useEffect(() => {
    callback.current = onSuccess;
  });

  useEffect(() => {
    if (state.status === "success") callback.current?.();
  }, [state]);
}
