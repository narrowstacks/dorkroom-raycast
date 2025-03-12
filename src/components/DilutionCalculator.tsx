import { List, ActionPanel, Action, Icon, useNavigation, Detail } from "@raycast/api";
import { useEffect } from "react";
import { DilutionForm, VolumeInputForm, NameForm, EditForm } from "./DilutionForm";
import { DilutionDetail } from "./DilutionDetail";
import { useDilutionCalculator } from "../hooks/useDilutionCalculator";
import { formatDilutionResult } from "../utils/dilution";

export function DilutionCalculator() {
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
                  <Action
                    title={`Use ${dilution.name} (${dilution.ratio})`}
                    icon={Icon.ArrowRight}
                    onAction={() => {
                      setSearchText(dilution.ratio.replace(":", "+"));
                      setPendingRatio(dilution.ratio.replace(":", "+"));
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
                                  setSearchText(dil.ratio.replace(":", "+"));
                                  setPendingRatio(dil.ratio.replace(":", "+"));
                                }}
                              />
                            ))}
                          </ActionPanel>
                        }
                      />
                    }
                  />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      )}

      {currentCalculation && (
        <List.Section title="Current Calculation">
          <List.Item
            title={`${currentCalculation.ratio} - ${currentCalculation.amount}${volumeUnit}`}
            subtitle={formatDilutionResult(currentCalculation, volumeUnit)}
            actions={
              <ActionPanel>
                <Action
                  title="Save With Name"
                  icon={Icon.SaveDocument}
                  onAction={() => {
                    const result = calculateDilution(currentCalculation.ratio, currentCalculation.amount);
                    if (result) {
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
                    }
                  }}
                />
                <Action
                  title="Quick Save"
                  icon={Icon.SaveDocument}
                  onAction={() => {
                    saveCurrentRatio(currentCalculation.ratio, currentCalculation.amount);
                  }}
                />
                <Action.CopyToClipboard
                  title="Copy Results"
                  content={formatDilutionResult(currentCalculation, volumeUnit)}
                />
              </ActionPanel>
            }
          />
        </List.Section>
      )}

      <List.Section title="Saved Ratios" subtitle={savedRatios.length > 0 ? `${savedRatios.length} saved` : undefined}>
        {savedRatios.map((ratio) => {
          const result = calculateDilution(ratio.ratio, ratio.amount);
          return (
            <List.Item
              key={ratio.id}
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
                      const result = calculateDilution(ratio.ratio, ratio.amount);
                      if (result) {
                        push(<DilutionDetail result={result} volumeUnit={volumeUnit} />);
                      }
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
        {developers.map((developer) =>
          developer.commonDilutions.map((dilution) => (
            <List.Item
              key={`${developer.name}-${dilution.name}`}
              title={`${developer.name} - ${dilution.name}`}
              subtitle={dilution.description}
              accessories={[{ text: dilution.ratio }, { text: developer.brand }, { text: developer.type }]}
              actions={
                <ActionPanel>
                  <Action
                    title={`Use ${dilution.name} (${dilution.ratio})`}
                    icon={Icon.ArrowRight}
                    onAction={() => {
                      setSearchText(dilution.ratio.replace(":", "+"));
                      setPendingRatio(dilution.ratio.replace(":", "+"));
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
                                  setSearchText(dil.ratio.replace(":", "+"));
                                  setPendingRatio(dil.ratio.replace(":", "+"));
                                }}
                              />
                            ))}
                          </ActionPanel>
                        }
                      />
                    }
                  />
                </ActionPanel>
              }
            />
          )),
        )}
      </List.Section>
    </List>
  );
}
