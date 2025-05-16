import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { DilutionResult } from "../../types/dilution";

interface CalculatorDisplayProps {
  input: string;
  result: DilutionResult;
  onSave?: (name?: string) => void;
  onQuickSave?: () => void;
  onCopy?: () => void;
}

export function CalculatorDisplay({ input, result, onSave, onQuickSave, onCopy }: CalculatorDisplayProps) {
  return (
    <List.Item
      title={result.volumes.map((vol, i) => `${result.labels[i]}: ${vol.toFixed(2)}ml`).join(" • ")}
      subtitle={`${input} - ${result.amount}ml total`}
      actions={
        <ActionPanel>
          {onSave && <Action title="Save with Name" icon={Icon.SaveDocument} onAction={onSave} />}
          {onQuickSave && <Action title="Quick Save" icon={Icon.SaveDocument} onAction={onQuickSave} />}
          {onCopy && (
            <Action.CopyToClipboard
              title="Copy Results"
              content={result.volumes.map((vol, i) => `${result.labels[i]}: ${vol.toFixed(2)}ml`).join(", ")}
              onCopy={onCopy}
            />
          )}
        </ActionPanel>
      }
    />
  );
}
