import {
  List,
  ActionPanel,
  Action,
  Icon,
  useNavigation,
  Detail,
  getPreferenceValues,
  openExtensionPreferences,
} from "@raycast/api";
import { useEffect } from "react";
import { DilutionForm, VolumeInputForm, NameForm, EditForm } from "./DilutionForm";
import { DilutionDetail } from "./DilutionDetail";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { useDilutionCalculator } from "../hooks/useDilutionCalculator";
import { formatDilutionResult } from "../utils/dilution";
import { Color } from "@raycast/api";

interface Preferences {
  preferredDeveloper?: string;
}

export function DilutionCalculator() {
  const { preferredDeveloper } = getPreferenceValues<Preferences>();
  const {
    savedRatios,
    searchText,
    setSearchText,
    pendingRatio,
    setPendingRatio,
    developers,
    volumeUnit,
    filteredDilutions,
    currentCalculation,
    handleSearchSubmit,
    deleteSavedRatio,
    saveCurrentRatio,
    updateRatioName,
    updateSavedRatio,
    calculateDilution,
  } = useDilutionCalculator();

  const { push, pop } = useNavigation();

  // Sort developers to put preferred developer first
  const sortedDevelopers = [...developers].sort((a, b) => {
    if (preferredDeveloper) {
      const aIsPreferred = a.name.includes(preferredDeveloper.replace(/%/g, ""));
      const bIsPreferred = b.name.includes(preferredDeveloper.replace(/%/g, ""));
      if (aIsPreferred && !bIsPreferred) return -1;
      if (!aIsPreferred && bIsPreferred) return 1;
    }
    return 0;
  });

  useEffect(() => {
    if (pendingRatio) {
      push(
        <VolumeInputForm
          ratio={pendingRatio}
          volumeUnit={volumeUnit}
          onSubmit={(amount) => {
            const result = calculateDilution(pendingRatio, amount);
            if (result) {
              push(
                <DilutionDetail
                  result={result}
                  volumeUnit={volumeUnit}
                  onSave={() => {
                    push(
                      <NameForm
                        ratio={pendingRatio}
                        amount={amount}
                        volumeUnit={volumeUnit}
                        onSubmit={(name) => {
                          saveCurrentRatio(pendingRatio, amount, name);
                          setPendingRatio(null);
                          setSearchText("");
                          pop();
                          pop();
                        }}
                      />,
                    );
                  }}
                />,
              );
              setPendingRatio(null);
              setSearchText("");
            }
          }}
        />,
      );
    }
  }, [pendingRatio]);

  return (
    <List
      searchBarPlaceholder="Search developers or enter ratio (e.g., 'HC-110', 'Dilution B', '1+31', '31 500')"
      onSearchTextChange={setSearchText}
      searchText={searchText}
      selectedItemId={savedRatios.length > 0 ? savedRatios[0].id : undefined}
      actions={
        <ActionPanel>
          <Action
            title="Calculate"
            icon={Icon.Calculator}
            onAction={handleSearchSubmit}
            shortcut={{ modifiers: [], key: "return" }}
          />
          <Action
            title="New Calculation"
            icon={Icon.Plus}
            onAction={() =>
              push(
                <DilutionForm
                  onSubmit={async (values) => {
                    await saveCurrentRatio(values.ratio, parseFloat(values.amount), values.name);
                  }}
                  volumeUnit={volumeUnit}
                />,
              )
            }
          />
        </ActionPanel>
      }
    >
      {filteredDilutions.length > 0 && (
        <List.Section title="Developer Dilutions" subtitle={`${filteredDilutions.length} found`}>
          {filteredDilutions.map(({ developer, dilution }) => (
            <List.Item
              key={`${developer.name}-${dilution.name}`}
              title={`${dilution.name} (${dilution.ratio})`}
              subtitle={dilution.description}
              accessories={[{ text: developer.name }, { text: developer.brand }, { text: developer.type }]}
              actions={
                <ActionPanel>
                  <ActionPanel.Section>
                    <Action
                      title={`Use ${dilution.name} (${dilution.ratio})`}
                      icon={Icon.ArrowRight}
                      onAction={() => {
                        const volumeMatch = searchText.match(/\d+(?:\.\d+)?/);
                        const volume = volumeMatch ? volumeMatch[0] : "";
                        setSearchText(`${dilution.ratio.replace(":", "+")}${volume ? ` ${volume}` : " "}`);
                      }}
                    />
                    <Action.Push
                      title="View Developer Details"
                      icon={Icon.Sidebar}
                      target={
                        <Detail
                          markdown={`# ${developer.name}
                          
## ${developer.brand} - ${developer.type}

### Common Dilutions

${developer.commonDilutions
  .map(
    (dil) => `#### ${dil.name} (${dil.ratio})
${dil.description}`,
  )
  .join("\n\n")}`}
                          actions={
                            <ActionPanel>
                              {developer.commonDilutions.map((dil) => (
                                <Action
                                  key={dil.name}
                                  title={`Use ${dil.name} (${dil.ratio})`}
                                  icon={Icon.ArrowRight}
                                  onAction={() => {
                                    pop();
                                    const volumeMatch = searchText.match(/\d+(?:\.\d+)?/);
                                    const volume = volumeMatch ? volumeMatch[0] : "";
                                    setSearchText(`${dil.ratio.replace(":", "+")}${volume ? ` ${volume}` : " "}`);
                                  }}
                                />
                              ))}
                            </ActionPanel>
                          }
                        />
                      }
                    />
                  </ActionPanel.Section>
                  <ActionPanel.Section title="Developer Preferences">
                    {preferredDeveloper?.replace(/%/g, "") === developer.name ? (
                      <Action
                        title="Remove as Preferred Developer"
                        icon={Icon.Star}
                        style={Action.Style.Destructive}
                        onAction={openExtensionPreferences}
                        shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
                      />
                    ) : (
                      <Action
                        title="Set as Preferred Developer"
                        icon={Icon.Star}
                        onAction={openExtensionPreferences}
                        shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
                      />
                    )}
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      )}

      {currentCalculation && (
        <List.Section title="Current Calculation">
          <CalculatorDisplay
            input={`${currentCalculation.ratio}`}
            result={currentCalculation}
            onSave={() => {
              push(
                <NameForm
                  ratio={currentCalculation.ratio}
                  amount={currentCalculation.amount}
                  volumeUnit={volumeUnit}
                  onSubmit={(name) => {
                    saveCurrentRatio(currentCalculation.ratio, currentCalculation.amount, name);
                    pop();
                  }}
                />,
              );
            }}
            onQuickSave={() => {
              saveCurrentRatio(currentCalculation.ratio, currentCalculation.amount);
            }}
            onCopy={() => {}}
          />
        </List.Section>
      )}

      <List.Section
        title="Saved Calculations"
        subtitle={savedRatios.length > 0 ? `${savedRatios.length} saved` : undefined}
      >
        {savedRatios.map((ratio) => {
          const result = calculateDilution(ratio.ratio, ratio.amount);
          return (
            <List.Item
              key={ratio.id}
              id={ratio.id}
              title={ratio.name || ratio.ratio}
              icon={ratio.icon}
              subtitle={
                result
                  ? formatDilutionResult(result, volumeUnit, ratio.chemicalNames)
                  : `${ratio.amount}${volumeUnit} total`
              }
              accessories={[{ text: `${ratio.amount}${volumeUnit} total` }]}
              actions={
                <ActionPanel>
                  <Action
                    title="Calculate"
                    icon={Icon.Calculator}
                    onAction={() => {
                      setSearchText(`${ratio.ratio} ${ratio.amount}`);
                    }}
                  />
                  <Action
                    title="Edit"
                    icon={Icon.Pencil}
                    onAction={() => {
                      push(
                        <EditForm
                          ratio={ratio}
                          volumeUnit={volumeUnit}
                          onSubmit={(updatedRatio) => {
                            updateSavedRatio(ratio.id, updatedRatio);
                            pop();
                          }}
                        />,
                      );
                    }}
                  />
                  <Action
                    title="Delete"
                    icon={Icon.Trash}
                    style={Action.Style.Destructive}
                    onAction={() => deleteSavedRatio(ratio.id)}
                  />
                </ActionPanel>
              }
            />
          );
        })}
      </List.Section>

      <List.Section title="Manufacturer/Common Dilutions">
        {sortedDevelopers.map((developer) =>
          developer.commonDilutions.map((dilution) => (
            <List.Item
              key={`${developer.name}-${dilution.name}`}
              title={`${developer.name} - ${dilution.name}`}
              subtitle={dilution.description}
              accessories={[
                { text: dilution.ratio },
                { text: developer.brand },
                { text: developer.type },
                ...(preferredDeveloper && developer.name.includes(preferredDeveloper.replace(/%/g, ""))
                  ? [{ tag: { value: "Preferred", color: Color.Green } }]
                  : []),
              ]}
              actions={
                <ActionPanel>
                  <ActionPanel.Section>
                    <Action
                      title={`Use ${dilution.name} (${dilution.ratio})`}
                      icon={Icon.ArrowRight}
                      onAction={() => {
                        const volumeMatch = searchText.match(/\d+(?:\.\d+)?/);
                        const volume = volumeMatch ? volumeMatch[0] : "";
                        setSearchText(`${dilution.ratio.replace(":", "+")}${volume ? ` ${volume}` : " "}`);
                      }}
                    />
                    <Action.Push
                      title="View Developer Details"
                      icon={Icon.Sidebar}
                      target={
                        <Detail
                          markdown={`# ${developer.name}
                          
## ${developer.brand} - ${developer.type}

### Common Dilutions

${developer.commonDilutions
  .map(
    (dil) => `#### ${dil.name} (${dil.ratio})
${dil.description}`,
  )
  .join("\n\n")}`}
                          actions={
                            <ActionPanel>
                              {developer.commonDilutions.map((dil) => (
                                <Action
                                  key={dil.name}
                                  title={`Use ${dil.name} (${dil.ratio})`}
                                  icon={Icon.ArrowRight}
                                  onAction={() => {
                                    pop();
                                    const volumeMatch = searchText.match(/\d+(?:\.\d+)?/);
                                    const volume = volumeMatch ? volumeMatch[0] : "";
                                    setSearchText(`${dil.ratio.replace(":", "+")}${volume ? ` ${volume}` : " "}`);
                                  }}
                                />
                              ))}
                            </ActionPanel>
                          }
                        />
                      }
                    />
                  </ActionPanel.Section>
                  <ActionPanel.Section title="Developer Preferences">
                    {preferredDeveloper?.replace(/%/g, "") === developer.name ? (
                      <Action
                        title="Remove as Preferred Developer"
                        icon={Icon.Star}
                        style={Action.Style.Destructive}
                        onAction={openExtensionPreferences}
                        shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
                      />
                    ) : (
                      <Action
                        title="Set as Preferred Developer"
                        icon={Icon.Star}
                        onAction={openExtensionPreferences}
                        shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
                      />
                    )}
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          )),
        )}
      </List.Section>
    </List>
  );
}
