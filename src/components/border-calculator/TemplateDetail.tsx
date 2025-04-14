import { Detail, ActionPanel, Action, Icon, useNavigation } from "@raycast/api";
import { BorderTemplate } from "../../lib/border-calculator/types";
import { calculateBorderTemplate } from "../../lib/border-calculator/calculations";
import { getTemplateImage } from "../../lib/border-calculator/svg-renderer";
import { useEffect, useState } from "react";
import { saveTemplate } from "../../lib/border-calculator/storage";

interface TemplateDetailProps {
  template: BorderTemplate;
  onDeleteTemplate?: () => void;
  onTemplateUpdated?: () => void;
  fromForm?: boolean;
  onBackToForm?: () => void;
  onBack?: () => void;
}

export function TemplateDetail({
  template,
  onDeleteTemplate,
  onTemplateUpdated,
  fromForm = false,
  onBackToForm,
  onBack,
}: TemplateDetailProps) {
  const { pop } = useNavigation();
  const [currentTemplate, setCurrentTemplate] = useState<BorderTemplate>(template);
  const calculation = calculateBorderTemplate(currentTemplate);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      try {
        const dataUrl = await getTemplateImage(currentTemplate, calculation);
        setImageDataUrl(dataUrl);
      } catch (error) {
        console.error("Failed to load template image:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [currentTemplate.id, currentTemplate.aspectRatio, currentTemplate.paperDimensions]);

  useEffect(() => {
    return () => {
      if (fromForm && onBackToForm) {
        onBackToForm();
      }
    };
  }, [fromForm, onBackToForm]);

  const toggleAspectOrientation = async () => {
    const updatedTemplate = {
      ...currentTemplate,
      aspectRatio: {
        width: currentTemplate.aspectRatio.height,
        height: currentTemplate.aspectRatio.width,
      },
      updatedAt: Date.now(),
    };
    setCurrentTemplate(updatedTemplate);
    await saveTemplate(updatedTemplate);
  };

  const togglePaperOrientation = async () => {
    const updatedTemplate = {
      ...currentTemplate,
      paperDimensions: {
        width: currentTemplate.paperDimensions.height,
        height: currentTemplate.paperDimensions.width,
      },
      updatedAt: Date.now(),
    };
    setCurrentTemplate(updatedTemplate);
    await saveTemplate(updatedTemplate);
  };

  const goBackToTemplateList = () => {
    if (onTemplateUpdated) {
      onTemplateUpdated();
    }

    if (onBack) {
      onBack();
    } else {
      pop();
    }
  };

  const markdown = `
# ${currentTemplate.name}
${
  isLoading
    ? "Loading visualization..."
    : imageDataUrl
      ? `![Border Template Visualization](${imageDataUrl})`
      : "Failed to load visualization."
}

## Border Settings
- Minimum Border: ${currentTemplate.minimumBorder}"
- Horizontal Offset: ${currentTemplate.horizontalOffset}"
- Vertical Offset: ${currentTemplate.verticalOffset}"

## Print Details
- Paper Size: ${currentTemplate.paperDimensions.width}" × ${currentTemplate.paperDimensions.height}"
- Aspect Ratio: ${currentTemplate.aspectRatio.width}:${currentTemplate.aspectRatio.height}
- Print Size: ${calculation.printDimensions.width.toFixed(2)}" × ${calculation.printDimensions.height.toFixed(2)}"

## Blade Positions (with easel offsets)
- Left: ${calculation.bladePositions.left.toFixed(2)}"
- Right: ${calculation.bladePositions.right.toFixed(2)}"
- Top: ${calculation.bladePositions.top.toFixed(2)}"
- Bottom: ${calculation.bladePositions.bottom.toFixed(2)}"

${
  calculation.warnings.length > 0
    ? `
## ⚠️ Warnings
${calculation.warnings.map((warning) => `- ${warning}`).join("\n")}
`
    : ""
}
`;

  return (
    <Detail
      markdown={markdown}
      isLoading={isLoading}
      navigationTitle={currentTemplate.name}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title="Paper Size"
            text={`${currentTemplate.paperDimensions.width}" × ${currentTemplate.paperDimensions.height}"`}
          />
          <Detail.Metadata.Label
            title="Aspect Ratio"
            text={`${currentTemplate.aspectRatio.width}:${currentTemplate.aspectRatio.height}`}
          />
          <Detail.Metadata.Separator />

          <Detail.Metadata.Label
            title="Print Size"
            text={`${calculation.printDimensions.width.toFixed(2)}" × ${calculation.printDimensions.height.toFixed(2)}"`}
          />
          <Detail.Metadata.Separator />

          <Detail.Metadata.Label title="Borders" />
          <Detail.Metadata.Label title="Left" text={`${calculation.borders.left.toFixed(2)}"`} />
          <Detail.Metadata.Label title="Right" text={`${calculation.borders.right.toFixed(2)}"`} />
          <Detail.Metadata.Label title="Top" text={`${calculation.borders.top.toFixed(2)}"`} />
          <Detail.Metadata.Label title="Bottom" text={`${calculation.borders.bottom.toFixed(2)}"`} />
          <Detail.Metadata.Separator />

          <Detail.Metadata.Label title="Easel" text={calculation.easel.size.name} />
          <Detail.Metadata.Label
            title="Easel Size"
            text={`${calculation.easel.size.width}" × ${calculation.easel.size.height}"`}
          />
          <Detail.Metadata.Label
            title="Easel Offset"
            text={`${calculation.easel.offsets.width.toFixed(2)}" × ${calculation.easel.offsets.height.toFixed(2)}"`}
          />
          <Detail.Metadata.Separator />

          <Detail.Metadata.Label title="Blade Positions" />
          <Detail.Metadata.Label title="Left" text={`${calculation.bladePositions.left.toFixed(2)}"`} />
          <Detail.Metadata.Label title="Right" text={`${calculation.bladePositions.right.toFixed(2)}"`} />
          <Detail.Metadata.Label title="Top" text={`${calculation.bladePositions.top.toFixed(2)}"`} />
          <Detail.Metadata.Label title="Bottom" text={`${calculation.bladePositions.bottom.toFixed(2)}"`} />

          {calculation.warnings.length > 0 && (
            <>
              <Detail.Metadata.Separator />
              <Detail.Metadata.TagList title="Warnings">
                {calculation.warnings.map((warning, index) => (
                  <Detail.Metadata.TagList.Item key={index} text={warning} color="#FF9500" />
                ))}
              </Detail.Metadata.TagList>
            </>
          )}
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action
            title="Back to Templates"
            icon={Icon.ArrowLeft}
            shortcut={{ modifiers: ["cmd"], key: "[" }}
            onAction={goBackToTemplateList}
          />
          <Action.CopyToClipboard
            title="Copy Measurements"
            content={markdown}
            shortcut={{ modifiers: ["cmd"], key: "c" }}
          />
          <Action
            title="Toggle Aspect Orientation"
            icon={Icon.Switch}
            shortcut={{ modifiers: ["cmd", "shift"], key: "a" }}
            onAction={toggleAspectOrientation}
          />
          <Action
            title="Toggle Paper Orientation"
            icon={Icon.Switch}
            shortcut={{ modifiers: ["cmd", "shift"], key: "p" }}
            onAction={togglePaperOrientation}
          />
          <Action
            title="Edit Template"
            icon={Icon.Pencil}
            shortcut={{ modifiers: ["cmd"], key: "e" }}
            onAction={() => {
              // We'll implement edit functionality later
            }}
          />
          {onDeleteTemplate && (
            <Action
              title="Delete Template"
              icon={Icon.Trash}
              shortcut={{ modifiers: ["cmd"], key: "backspace" }}
              onAction={onDeleteTemplate}
              style={Action.Style.Destructive}
            />
          )}
        </ActionPanel>
      }
    />
  );
}
