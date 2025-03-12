import { Form, ActionPanel, Action, useNavigation, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { DilutionRatio } from "../types/dilution";
import { calculateDilution } from "../utils/dilution";

interface DilutionFormProps {
  onSubmit: (values: { ratio: string; amount: string; name?: string }) => Promise<void>;
  volumeUnit: string;
}

export function DilutionForm({ onSubmit, volumeUnit }: DilutionFormProps) {
  const [ratio, setRatio] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const { pop } = useNavigation();

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Calculate"
            onSubmit={(values) => onSubmit(values as { ratio: string; amount: string; name?: string })}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="ratio" title="Ratio" placeholder="e.g., 1+31 or 1:1:100" value={ratio} onChange={setRatio} />
      <Form.TextField
        id="amount"
        title={`Total Amount (${volumeUnit})`}
        placeholder="e.g., 300"
        value={amount}
        onChange={setAmount}
      />
      <Form.TextField
        id="name"
        title="Save as (optional)"
        placeholder="e.g., DD-X 1+31 or Pyro 1:1:100"
        value={name}
        onChange={setName}
      />
    </Form>
  );
}

interface VolumeInputFormProps {
  ratio: string;
  volumeUnit: string;
  onSubmit: (amount: number) => void;
}

export function VolumeInputForm({ ratio, volumeUnit, onSubmit }: VolumeInputFormProps) {
  const [amount, setAmount] = useState("");

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Calculate"
            onSubmit={() => {
              const parsedAmount = parseFloat(amount);
              if (!isNaN(parsedAmount) && parsedAmount > 0) {
                onSubmit(parsedAmount);
              }
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="amount"
        title={`Total Amount (${volumeUnit})`}
        placeholder="e.g., 300"
        value={amount}
        onChange={setAmount}
        autoFocus
      />
    </Form>
  );
}

interface NameFormProps {
  ratio: string;
  amount: number;
  volumeUnit: string;
  onSubmit: (name: string) => void;
}

export function NameForm({ ratio, amount, volumeUnit, onSubmit }: NameFormProps) {
  const [name, setName] = useState("");

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Save"
            onSubmit={() => {
              if (name.trim()) {
                onSubmit(name.trim());
              }
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="name"
        title="Name"
        placeholder="e.g., DD-X 1+31 or Pyro 1:1:100"
        value={name}
        onChange={setName}
        autoFocus
      />
      <Form.Description title="Current Dilution" text={`${ratio} - ${amount}${volumeUnit}`} />
    </Form>
  );
}

interface EditFormProps {
  ratio: DilutionRatio;
  volumeUnit: string;
  onSubmit: (updatedRatio: Omit<DilutionRatio, "id">) => void;
}

export function EditForm({ ratio: initialRatio, volumeUnit, onSubmit }: EditFormProps) {
  const [ratio, setRatio] = useState(initialRatio.ratio);
  const [amount, setAmount] = useState(initialRatio.amount.toString());
  const [name, setName] = useState(initialRatio.name || "");
  const [icon, setIcon] = useState(initialRatio.icon || "");
  const [chemicalA, setChemicalA] = useState(initialRatio.chemicalNames?.a || "");
  const [chemicalB, setChemicalB] = useState(initialRatio.chemicalNames?.b || "");

  const showChemicalB = ratio.includes(":") && ratio.split(":").length > 2;

  async function handleSubmit() {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || isNaN(parsedAmount)) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Invalid amount",
        message: "Please enter a valid number for the amount",
      });
      return;
    }

    const result = calculateDilution(ratio, parsedAmount);
    if (!result) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Invalid ratio format",
        message: "Please use format like '1+31' or '1:1:100'",
      });
      return;
    }

    const chemicalNames = chemicalA
      ? {
          a: chemicalA,
          ...(showChemicalB && chemicalB ? { b: chemicalB } : {}),
        }
      : undefined;

    onSubmit({
      ratio,
      amount: parsedAmount,
      name: name.trim() || undefined,
      icon: icon.trim() || undefined,
      chemicalNames,
    });
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Changes" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="ratio" title="Ratio" placeholder="e.g., 1+31 or 1:1:100" value={ratio} onChange={setRatio} />
      <Form.TextField
        id="amount"
        title={`Total Amount (${volumeUnit})`}
        placeholder="e.g., 300"
        value={amount}
        onChange={setAmount}
      />
      <Form.TextField
        id="name"
        title="Name (optional)"
        placeholder="e.g., DD-X 1+31 or Pyro 1:1:100"
        value={name}
        onChange={setName}
      />
      <Form.TextField
        id="icon"
        title="Icon (optional)"
        placeholder="Enter a Raycast icon name or emoji"
        value={icon}
        onChange={setIcon}
      />
      <Form.Description text="You can use Raycast icons (e.g., 'beaker') or system emojis (e.g., '🧪')" />
      <Form.TextField
        id="chemicalA"
        title="First Chemical Name (optional)"
        placeholder="e.g., Developer"
        value={chemicalA}
        onChange={setChemicalA}
      />
      {showChemicalB && (
        <Form.TextField
          id="chemicalB"
          title="Second Chemical Name (optional)"
          placeholder="e.g., Activator"
          value={chemicalB}
          onChange={setChemicalB}
        />
      )}
    </Form>
  );
}
