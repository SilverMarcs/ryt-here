"use client";

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { BankUIMessage } from "@/types/ui";
import { BankState } from "@/types/bank";
import type {
  CardStatusChangeOutput,
  MoneyRequestOutput,
  TransactionLimitOutput,
} from "@/types/chat";

interface ToolOutputApplierOptions {
  messages: BankUIMessage[];
  setCardStatus: (status: BankState["user"]["card"]["status"]) => void;
  setTransactionLimit: (newLimit: number) => void;
  setState: Dispatch<SetStateAction<BankState>>;
}

export const useToolOutputApplier = ({
  messages,
  setCardStatus,
  setTransactionLimit,
  setState,
}: ToolOutputApplierOptions) => {
  const appliedToolOutputs = useRef<Set<string>>(new Set());

  useEffect(() => {
    messages.forEach((message) => {
      if (message.role !== "assistant") return;

      message.parts.forEach((part) => {
        if (part.type === "tool-set_card_status") {
          if (part.state !== "output-available" || !part.output) return;
          if (appliedToolOutputs.current.has(part.toolCallId)) return;
          const output = part.output as CardStatusChangeOutput;
          setCardStatus(output.status);
          appliedToolOutputs.current.add(part.toolCallId);
          return;
        }

        if (part.type === "tool-update_transaction_limit") {
          if (part.state !== "output-available" || !part.output) return;
          if (appliedToolOutputs.current.has(part.toolCallId)) return;
          const output = part.output as TransactionLimitOutput;
          if (output.newLimit !== undefined) {
            // Add 5 second delay before applying the limit change
            setTimeout(() => {
              setTransactionLimit(output.newLimit!);
            }, 5000);
            appliedToolOutputs.current.add(part.toolCallId);
          }
          return;
        }

        if (part.type === "tool-request_money") {
          if (part.state !== "output-available" || !part.output) return;
          if (appliedToolOutputs.current.has(part.toolCallId)) return;
          const output = part.output as MoneyRequestOutput;
          if (output.status !== "confirmed") {
            if (output.status === "cancelled") {
              appliedToolOutputs.current.add(part.toolCallId);
            }
            return;
          }
          setState((prev) => {
            const exists = prev.moneyRequests.some(
              (req) => req.id === output.request.id,
            );
            if (exists) return prev;
            return {
              ...prev,
              moneyRequests: [output.request, ...prev.moneyRequests],
            };
          });
          appliedToolOutputs.current.add(part.toolCallId);
        }
      });
    });
  }, [messages, setCardStatus, setState, setTransactionLimit]);
};
