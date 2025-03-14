import { Form, ActionPanel, Action, useNavigation, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { DilutionRatio } from "../../types/dilution";
import { calculateDilution } from "../../utils/dilution";
import { DILUTION_CALCULATOR_STRINGS as STRINGS } from "../../constants/strings";

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
            title={STRINGS.FORM.ACTIONS.CALCULATE}
            onSubmit={(values) => onSubmit(values as { ratio: string; amount: string; name?: string })}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="ratio"
        title={STRINGS.FORM.FIELDS.RATIO}
        placeholder={STRINGS.FORM.PLACEHOLDERS.RATIO}
        value={ratio}
        onChange={setRatio}
      />
      <Form.TextField
        id="amount"
        title={STRINGS.FORM.FIELDS.TOTAL_AMOUNT(volumeUnit)}
        placeholder={STRINGS.FORM.PLACEHOLDERS.TOTAL_AMOUNT}
        value={amount}
        onChange={setAmount}
      />
      <Form.TextField
        id="name"
        title={STRINGS.FORM.FIELDS.SAVE_AS}
        placeholder={STRINGS.FORM.PLACEHOLDERS.SAVE_AS}
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
            title={STRINGS.FORM.ACTIONS.CALCULATE}
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
        title={STRINGS.FORM.FIELDS.TOTAL_AMOUNT(volumeUnit)}
        placeholder={STRINGS.FORM.PLACEHOLDERS.TOTAL_AMOUNT}
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
            title={STRINGS.FORM.ACTIONS.SAVE}
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
        title={STRINGS.FORM.FIELDS.NAME}
        placeholder={STRINGS.FORM.PLACEHOLDERS.SAVE_AS}
        value={name}
        onChange={setName}
        autoFocus
      />
      <Form.Description title={STRINGS.FORM.DESCRIPTIONS.CURRENT_DILUTION} text={`${ratio} - ${amount}${volumeUnit}`} />
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
        title: STRINGS.FORM.VALIDATION.INVALID_AMOUNT.TITLE,
        message: STRINGS.FORM.VALIDATION.INVALID_AMOUNT.MESSAGE,
      });
      return;
    }

    const result = calculateDilution(ratio, parsedAmount);
    if (!result) {
      await showToast({
        style: Toast.Style.Failure,
        title: STRINGS.FORM.VALIDATION.INVALID_RATIO.TITLE,
        message: STRINGS.FORM.VALIDATION.INVALID_RATIO.MESSAGE,
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
          <Action.SubmitForm title={STRINGS.FORM.ACTIONS.SAVE} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="ratio"
        title={STRINGS.FORM.FIELDS.RATIO}
        placeholder={STRINGS.FORM.PLACEHOLDERS.RATIO}
        value={ratio}
        onChange={setRatio}
      />
      <Form.TextField
        id="amount"
        title={STRINGS.FORM.FIELDS.TOTAL_AMOUNT(volumeUnit)}
        placeholder={STRINGS.FORM.PLACEHOLDERS.TOTAL_AMOUNT}
        value={amount}
        onChange={setAmount}
      />
      <Form.TextField
        id="name"
        title={STRINGS.FORM.FIELDS.NAME}
        placeholder={STRINGS.FORM.PLACEHOLDERS.SAVE_AS}
        value={name}
        onChange={setName}
      />
      <Form.TextField
        id="icon"
        title={STRINGS.FORM.FIELDS.ICON}
        placeholder={STRINGS.FORM.PLACEHOLDERS.ICON}
        value={icon}
        onChange={setIcon}
      />
      <Form.Description text={STRINGS.FORM.DESCRIPTIONS.ICON} />
      <Form.TextField
        id="chemicalA"
        title={STRINGS.FORM.FIELDS.FIRST_CHEMICAL}
        placeholder={STRINGS.FORM.PLACEHOLDERS.FIRST_CHEMICAL}
        value={chemicalA}
        onChange={setChemicalA}
      />
      {showChemicalB && (
        <Form.TextField
          id="chemicalB"
          title={STRINGS.FORM.FIELDS.SECOND_CHEMICAL}
          placeholder={STRINGS.FORM.PLACEHOLDERS.SECOND_CHEMICAL}
          value={chemicalB}
          onChange={setChemicalB}
        />
      )}
    </Form>
  );
}
