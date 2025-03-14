import {
  List,
  ActionPanel,
  Action,
  Icon,
  useNavigation,
  Detail,
  getPreferenceValues,
  openExtensionPreferences,
  LocalStorage,
  Color,
} from "@raycast/api";
import { useEffect, useState, useMemo } from "react";
import { DilutionForm, VolumeInputForm, NameForm, EditForm } from "./DilutionForm";
import { DilutionDetail } from "./DilutionDetail";
import { CalculatorDisplay } from "./DilutionCalculatorDisplay";
import { useDilutionCalculator } from "../../hooks/useDilutionCalculator";
import { formatDilutionResult } from "../../utils/dilution";
import { extractVolumeFromSearch } from "../../utils/dilution";
import { DILUTION_CALCULATOR_STRINGS as STRINGS } from "../../constants/strings";

interface Preferences {
  volumeUnit: string;
  defaultNotation: string;
}

export function DilutionCalculator() {
  const preferences = getPreferenceValues<Preferences>();
  const { volumeUnit, defaultNotation } = preferences;
  const {
    savedRatios,
    searchText,
    setSearchText,
    pendingRatio,
    setPendingRatio,
    developers,
    filteredDilutions,
    currentCalculation,
    handleSearchSubmit,
    deleteSavedRatio,
    saveCurrentRatio,
    updateRatioName,
    updateSavedRatio,
    calculateDilution,
    preferredDeveloper,
    setPreferredDeveloper,
  } = useDilutionCalculator();

  const { push, pop } = useNavigation();

  // Sort developers alphabetically and put preferred developer first
  const sortedDevelopers = useMemo(() => {
    const sorted = [...developers].sort((a, b) => a.name.localeCompare(b.name));
    if (preferredDeveloper) {
      const preferredName = preferredDeveloper.replace(/%/g, "");
      return sorted.sort((a, b) => {
        const aIsPreferred = a.name === preferredName;
        const bIsPreferred = b.name === preferredName;
        if (aIsPreferred && !bIsPreferred) return -1;
        if (!aIsPreferred && bIsPreferred) return 1;
        return 0;
      });
    }
    return sorted;
  }, [developers, preferredDeveloper]);

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
      searchBarPlaceholder={STRINGS.SEARCH.PLACEHOLDER}
      onSearchTextChange={setSearchText}
      searchText={searchText}
      selectedItemId={savedRatios.length > 0 ? savedRatios[0].id : undefined}
      actions={
        <ActionPanel>
          <Action
            title={STRINGS.ACTIONS.CALCULATE}
            icon={Icon.Calculator}
            onAction={handleSearchSubmit}
            shortcut={{ modifiers: [], key: "return" }}
          />
          <Action
            title={STRINGS.ACTIONS.NEW_CALCULATION}
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
      {currentCalculation && (
        <List.Section title={STRINGS.SECTIONS.CURRENT_CALCULATION}>
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

      <List.Section title={STRINGS.SECTIONS.CREATE_CUSTOM}>
        <List.Item
          title="Create New Dilution"
          icon={Icon.Plus}
          actions={
            <ActionPanel>
              <Action
                title="Create Custom Dilution"
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
        />
      </List.Section>

      {filteredDilutions.length > 0 && (
        <List.Section
          title={STRINGS.SECTIONS.DEVELOPER_DILUTIONS}
          subtitle={STRINGS.SECTIONS.DEVELOPER_DILUTIONS_FOUND(filteredDilutions.length)}
        >
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
                      title={STRINGS.ACTIONS.USE_DILUTION(dilution.name, dilution.ratio)}
                      icon={Icon.ArrowRight}
                      onAction={() => {
                        const { volume } = extractVolumeFromSearch(searchText);
                        setSearchText(`${dilution.ratio.replace(":", "+")}${volume ? ` ${volume}` : " "}`);
                      }}
                    />
                    <Action.Push
                      title={STRINGS.ACTIONS.VIEW_DEVELOPER_DETAILS}
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
                                  title={STRINGS.ACTIONS.USE_DILUTION(dil.name, dil.ratio)}
                                  icon={Icon.ArrowRight}
                                  onAction={() => {
                                    pop();
                                    const { volume } = extractVolumeFromSearch(searchText);
                                    setSearchText(`${dil.ratio.replace(":", "+")}${volume ? ` ${volume}` : " "}`);
                                  }}
                                />
                              ))}
                            </ActionPanel>
                          }
                        />
                      }
                    />
                    {preferredDeveloper?.replace(/%/g, "") === developer.name ? (
                      <Action
                        title={STRINGS.ACTIONS.REMOVE_PREFERRED_DEVELOPER}
                        icon={Icon.Star}
                        style={Action.Style.Destructive}
                        onAction={() => setPreferredDeveloper(undefined)}
                        shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
                      />
                    ) : (
                      <Action
                        title={STRINGS.ACTIONS.SET_PREFERRED_DEVELOPER}
                        icon={Icon.Star}
                        onAction={() => setPreferredDeveloper(developer.name + "%")}
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

      <List.Section
        title={STRINGS.SECTIONS.SAVED_CALCULATIONS}
        subtitle={savedRatios.length > 0 ? STRINGS.SECTIONS.SAVED_COUNT(savedRatios.length) : undefined}
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
                    title={STRINGS.ACTIONS.CALCULATE}
                    icon={Icon.Calculator}
                    onAction={() => {
                      setSearchText(`${ratio.ratio} ${ratio.amount}`);
                    }}
                  />
                  <Action
                    title={STRINGS.ACTIONS.EDIT}
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
                    title={STRINGS.ACTIONS.DELETE}
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

      <List.Section title={STRINGS.SECTIONS.MANUFACTURER_COMMON}>
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
                  ? [{ tag: { value: STRINGS.ACTIONS.PREFERRED_TAG, color: Color.Green } }]
                  : []),
              ]}
              actions={
                <ActionPanel>
                  <ActionPanel.Section>
                    <Action
                      title={STRINGS.ACTIONS.USE_DILUTION(dilution.name, dilution.ratio)}
                      icon={Icon.ArrowRight}
                      onAction={() => {
                        const { volume } = extractVolumeFromSearch(searchText);
                        setSearchText(`${dilution.ratio.replace(":", "+")}${volume ? ` ${volume}` : " "}`);
                      }}
                    />
                    <Action.Push
                      title={STRINGS.ACTIONS.VIEW_DEVELOPER_DETAILS}
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
                                  title={STRINGS.ACTIONS.USE_DILUTION(dil.name, dil.ratio)}
                                  icon={Icon.ArrowRight}
                                  onAction={() => {
                                    pop();
                                    const { volume } = extractVolumeFromSearch(searchText);
                                    setSearchText(`${dil.ratio.replace(":", "+")}${volume ? ` ${volume}` : " "}`);
                                  }}
                                />
                              ))}
                            </ActionPanel>
                          }
                        />
                      }
                    />
                    {preferredDeveloper?.replace(/%/g, "") === developer.name ? (
                      <Action
                        title={STRINGS.ACTIONS.REMOVE_PREFERRED_DEVELOPER}
                        icon={Icon.Star}
                        style={Action.Style.Destructive}
                        onAction={() => setPreferredDeveloper(undefined)}
                        shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
                      />
                    ) : (
                      <Action
                        title={STRINGS.ACTIONS.SET_PREFERRED_DEVELOPER}
                        icon={Icon.Star}
                        onAction={() => setPreferredDeveloper(developer.name + "%")}
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
