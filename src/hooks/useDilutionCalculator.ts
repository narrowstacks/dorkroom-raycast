import { useState, useEffect, useMemo } from "react";
import { LocalStorage, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { DilutionRatio, DilutionResult, Developer, Preferences } from "../types/dilution";
import { calculateDilution, fuzzyMatch, parseSearch, formatDilutionResult } from "../utils/dilution";
import developersData from "../data/developers.json";

export function useDilutionCalculator() {
  const [savedRatios, setSavedRatios] = useState<DilutionRatio[]>([]);
  const [searchText, setSearchText] = useState("");
  const [pendingRatio, setPendingRatio] = useState<string | null>(null);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const { volumeUnit, defaultNotation } = getPreferenceValues<Preferences>();

  useEffect(() => {
    loadSavedRatios();
    setDevelopers(developersData.developers);
  }, []);

  async function loadSavedRatios() {
    const saved = await LocalStorage.getItem<string>("savedRatios");
    if (saved) {
      setSavedRatios(JSON.parse(saved));
    }
  }

  async function deleteSavedRatio(id: string) {
    const updated = savedRatios.filter((ratio) => ratio.id !== id);
    await LocalStorage.setItem("savedRatios", JSON.stringify(updated));
    setSavedRatios(updated);
  }

  async function saveCurrentRatio(ratio: string, amount: number, name?: string) {
    const savedRatios = await LocalStorage.getItem<string>("savedRatios");
    const ratios: DilutionRatio[] = savedRatios ? JSON.parse(savedRatios) : [];
    const newRatio: DilutionRatio = {
      id: Date.now().toString(),
      ratio,
      amount,
      name: name || `${ratio} (${amount}${volumeUnit})`,
    };
    ratios.push(newRatio);
    await LocalStorage.setItem("savedRatios", JSON.stringify(ratios));
    setSavedRatios(ratios);
    await showToast({
      style: Toast.Style.Success,
      title: "Ratio Saved",
      message: name ? `Saved as "${name}"` : `Saved ${ratio} with amount ${amount}${volumeUnit}`,
    });
  }

  async function updateRatioName(id: string, newName: string) {
    const updated = savedRatios.map((ratio) => (ratio.id === id ? { ...ratio, name: newName } : ratio));
    await LocalStorage.setItem("savedRatios", JSON.stringify(updated));
    setSavedRatios(updated);
    await showToast({
      style: Toast.Style.Success,
      title: "Name Updated",
      message: `Renamed to "${newName}"`,
    });
  }

  async function updateSavedRatio(id: string, updatedRatio: Omit<DilutionRatio, "id">) {
    const updated = savedRatios.map((r) => (r.id === id ? { ...r, ...updatedRatio } : r));
    await LocalStorage.setItem("savedRatios", JSON.stringify(updated));
    setSavedRatios(updated);
    await showToast({
      style: Toast.Style.Success,
      title: "Changes Saved",
      message: updatedRatio.name || updatedRatio.ratio,
    });
  }

  // Filter developers based on search text
  const filteredDilutions = useMemo(() => {
    const searchLower = searchText.toLowerCase();
    if (!searchLower) return [];

    return developers.flatMap((dev) =>
      dev.commonDilutions
        .filter(
          (dil) =>
            fuzzyMatch(dev.name, searchLower) ||
            fuzzyMatch(dev.brand, searchLower) ||
            fuzzyMatch(dil.name, searchLower) ||
            fuzzyMatch(dil.ratio, searchLower) ||
            fuzzyMatch(dev.name.replace(/-/g, ""), searchLower) ||
            fuzzyMatch(dev.brand.replace(/-/g, ""), searchLower) ||
            fuzzyMatch(dil.name.replace(/-/g, ""), searchLower),
        )
        .map((dil) => ({
          developer: dev,
          dilution: dil,
        })),
    );
  }, [developers, searchText]);

  // Get current calculation based on search text
  const currentCalculation = useMemo(() => {
    const parsed = parseSearch(searchText, defaultNotation);
    if (!parsed || parsed.amount === 0) return null;
    return calculateDilution(parsed.ratio, parsed.amount);
  }, [searchText, defaultNotation]);

  const handleSearchSubmit = () => {
    const parsed = parseSearch(searchText, defaultNotation);
    if (!parsed) return;

    if (parsed.amount === 0) {
      setPendingRatio(parsed.ratio);
    }
  };

  return {
    savedRatios,
    searchText,
    setSearchText,
    pendingRatio,
    setPendingRatio,
    developers,
    volumeUnit,
    defaultNotation,
    filteredDilutions,
    currentCalculation,
    handleSearchSubmit,
    deleteSavedRatio,
    saveCurrentRatio,
    updateRatioName,
    updateSavedRatio,
    calculateDilution,
    formatDilutionResult,
  };
} 