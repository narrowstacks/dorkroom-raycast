import { Form, ActionPanel, Action, useNavigation, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { BorderTemplate, PAPER_SIZES, ASPECT_RATIOS, PaperSize, AspectRatio } from "../../lib/border-calculator/types";
import { saveTemplate, deleteTemplate } from "../../lib/border-calculator/storage";
import { TemplateDetail } from "./TemplateDetail";

interface FormValues {
  name: string;
  paperSize: string;
  customPaperWidth?: string;
  customPaperHeight?: string;
  aspectRatio: string;
  customAspectWidth?: string;
  customAspectHeight?: string;
  minimumBorder: string;
  horizontalOffset: string;
  verticalOffset: string;
  aspectOrientation: string;
  paperOrientation: string;
}

interface FormErrors {
  name?: string;
  customPaperWidth?: string;
  customPaperHeight?: string;
  customAspectWidth?: string;
  customAspectHeight?: string;
  minimumBorder?: string;
  horizontalOffset?: string;
  verticalOffset?: string;
}

interface TemplateFormProps {
  onTemplateCreated?: () => void;
}

export function TemplateForm({ onTemplateCreated }: TemplateFormProps) {
  const { push, pop } = useNavigation();
  const [paperSize, setPaperSize] = useState<string>(PAPER_SIZES[3].value); // 8x10 default
  const [aspectRatio, setAspectRatio] = useState<string>(ASPECT_RATIOS[0].value); // 3:2 default
  const [aspectOrientation, setAspectOrientation] = useState<string>("horizontal");
  const [paperOrientation, setPaperOrientation] = useState<string>("horizontal");
  const [errors, setErrors] = useState<FormErrors>({});

  function validateNumber(value: string, fieldName: string, min = 0, max = 100): string | undefined {
    const num = parseFloat(value);
    if (isNaN(num)) return `${fieldName} must be a number`;
    if (num < min) return `${fieldName} must be at least ${min}`;
    if (num > max) return `${fieldName} must be less than ${max}`;
    return undefined;
  }

  function validateForm(values: FormValues): FormErrors {
    const newErrors: FormErrors = {};

    // Validate name
    if (!values.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate custom paper dimensions
    if (values.paperSize === "custom") {
      newErrors.customPaperWidth = validateNumber(values.customPaperWidth || "", "Paper width", 1, 30);
      newErrors.customPaperHeight = validateNumber(values.customPaperHeight || "", "Paper height", 1, 30);
    }

    // Validate custom aspect ratio
    if (values.aspectRatio === "custom") {
      newErrors.customAspectWidth = validateNumber(values.customAspectWidth || "", "Aspect width", 0.1, 100);
      newErrors.customAspectHeight = validateNumber(values.customAspectHeight || "", "Aspect height", 0.1, 100);
    }

    // Validate borders and offsets
    newErrors.minimumBorder = validateNumber(values.minimumBorder, "Minimum border", 0, 10);
    newErrors.horizontalOffset = validateNumber(values.horizontalOffset, "Horizontal offset", -10, 10);
    newErrors.verticalOffset = validateNumber(values.verticalOffset, "Vertical offset", -10, 10);

    return newErrors;
  }

  async function handleSubmit(values: FormValues) {
    // Validate form
    const formErrors = validateForm(values);
    const hasErrors = Object.values(formErrors).some((error) => error !== undefined);

    if (hasErrors) {
      setErrors(formErrors);
      await showToast({
        style: Toast.Style.Failure,
        title: "Invalid Input",
        message: "Please correct the errors in the form",
      });
      return;
    }

    // Get paper dimensions
    let paperDimensions;
    if (values.paperSize === "custom") {
      paperDimensions = {
        width: parseFloat(values.customPaperWidth || "0"),
        height: parseFloat(values.customPaperHeight || "0"),
      };
    } else {
      const selectedSize = PAPER_SIZES.find((size) => size.value === values.paperSize);
      paperDimensions = {
        width: selectedSize?.width || 0,
        height: selectedSize?.height || 0,
      };
    }

    // Get aspect ratio
    let aspectRatioDimensions;
    if (values.aspectRatio === "custom") {
      aspectRatioDimensions = {
        width: parseFloat(values.customAspectWidth || "0"),
        height: parseFloat(values.customAspectHeight || "0"),
      };
    } else {
      const selectedRatio = ASPECT_RATIOS.find((ratio) => ratio.value === values.aspectRatio);
      aspectRatioDimensions = {
        width: selectedRatio?.width || 0,
        height: selectedRatio?.height || 0,
      };
    }

    // Apply orientation if needed
    if (values.aspectOrientation === "horizontal") {
      aspectRatioDimensions = {
        width: aspectRatioDimensions.width,
        height: aspectRatioDimensions.height,
      };
    }

    if (values.paperOrientation === "horizontal") {
      paperDimensions = {
        width: paperDimensions.height,
        height: paperDimensions.width,
      };
    }

    const template: BorderTemplate = {
      id: uuidv4(),
      name: values.name,
      paperDimensions,
      aspectRatio: aspectRatioDimensions,
      minimumBorder: parseFloat(values.minimumBorder),
      horizontalOffset: parseFloat(values.horizontalOffset),
      verticalOffset: parseFloat(values.verticalOffset),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveTemplate(template);

    // Handle deletion directly from detail view of newly created template
    const handleDeleteTemplate = async () => {
      await deleteTemplate(template.id);
      pop();
    };

    push(
      <TemplateDetail
        template={template}
        onDeleteTemplate={handleDeleteTemplate}
        onTemplateUpdated={onTemplateCreated}
      />,
    );
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Template" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="name"
        title="Template Name"
        placeholder="Enter a name for this template"
        error={errors.name}
      />

      <Form.Dropdown id="paperSize" title="Paper Size" value={paperSize} onChange={setPaperSize}>
        {PAPER_SIZES.map((size) => (
          <Form.Dropdown.Item key={size.value} value={size.value} title={size.label} />
        ))}
      </Form.Dropdown>

      {paperSize === "custom" && (
        <>
          <Form.TextField
            id="customPaperWidth"
            title="Custom Paper Width"
            placeholder="Enter width in inches"
            error={errors.customPaperWidth}
          />
          <Form.TextField
            id="customPaperHeight"
            title="Custom Paper Height"
            placeholder="Enter height in inches"
            error={errors.customPaperHeight}
          />
        </>
      )}

      <Form.Dropdown
        id="paperOrientation"
        title="Paper Orientation"
        value={paperOrientation}
        onChange={setPaperOrientation}
      >
        <Form.Dropdown.Item value="horizontal" title="Horizontal (Landscape)" />
        <Form.Dropdown.Item value="vertical" title="Vertical (Portrait)" />
      </Form.Dropdown>

      <Form.Dropdown id="aspectRatio" title="Aspect Ratio" value={aspectRatio} onChange={setAspectRatio}>
        {ASPECT_RATIOS.map((ratio) => (
          <Form.Dropdown.Item key={ratio.value} value={ratio.value} title={ratio.label} />
        ))}
      </Form.Dropdown>

      {aspectRatio === "custom" && (
        <>
          <Form.TextField
            id="customAspectWidth"
            title="Custom Aspect Width"
            placeholder="Enter width ratio"
            error={errors.customAspectWidth}
          />
          <Form.TextField
            id="customAspectHeight"
            title="Custom Aspect Height"
            placeholder="Enter height ratio"
            error={errors.customAspectHeight}
          />
        </>
      )}

      <Form.Dropdown
        id="aspectOrientation"
        title="Aspect Ratio Orientation"
        value={aspectOrientation}
        onChange={setAspectOrientation}
      >
        <Form.Dropdown.Item value="horizontal" title="Horizontal" />
        <Form.Dropdown.Item value="vertical" title="Vertical" />
      </Form.Dropdown>

      <Form.TextField
        id="minimumBorder"
        title="Minimum Border"
        placeholder="Enter minimum border in inches"
        defaultValue="0.75"
        error={errors.minimumBorder}
      />

      <Form.TextField
        id="horizontalOffset"
        title="Horizontal Offset"
        placeholder="Enter horizontal offset in inches"
        defaultValue="0"
        error={errors.horizontalOffset}
      />

      <Form.TextField
        id="verticalOffset"
        title="Vertical Offset"
        placeholder="Enter vertical offset in inches"
        defaultValue="0"
        error={errors.verticalOffset}
      />
    </Form>
  );
}
