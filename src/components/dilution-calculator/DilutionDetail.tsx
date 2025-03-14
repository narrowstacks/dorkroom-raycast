import { Detail, ActionPanel, Action, Icon, useNavigation } from "@raycast/api";
import { DilutionResult } from "../../types/dilution";

interface DilutionDetailProps {
  result: DilutionResult;
  volumeUnit: string;
  onSave?: () => void;
}

export function DilutionDetail({ result, volumeUnit, onSave }: DilutionDetailProps) {
  const { pop } = useNavigation();

  return (
    <Detail
      markdown={`# Dilution Result
      
## ${result.ratio}
Total Amount: ${result.amount}${volumeUnit}

### Components
${result.labels.map((label, i) => `- ${label}: ${result.volumes[i]}${volumeUnit}`).join("\n")}`}
      navigationTitle="Dilution Result"
      actions={
        <ActionPanel>
          {onSave && <Action title="Save With Name" icon={Icon.SaveDocument} onAction={onSave} />}
          <Action.CopyToClipboard
            title="Copy Results"
            content={result.labels.map((label, i) => `${label}: ${result.volumes[i]}${volumeUnit}`).join(", ")}
            onCopy={() => {
              // Clear the navigation stack to return to main menu
              pop();
            }}
          />
        </ActionPanel>
      }
    />
  );
}
