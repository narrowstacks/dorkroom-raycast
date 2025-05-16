import { useState, useEffect } from "react";
import { LocalStorage, getPreferenceValues } from "@raycast/api";
import developersData from "../data/developers.json";
import { Developer } from "../types/dilution";

export function usePreferredDeveloper() {
  const [preferredDeveloper, setPreferredDeveloperState] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [developers, setDevelopers] = useState<Developer[]>([]);

  useEffect(() => {
    // Load developers and preferred developer on mount
    setDevelopers(developersData.developers);
    loadPreferredDeveloper();
  }, []);

  const loadPreferredDeveloper = async () => {
    try {
      const value = await LocalStorage.getItem<string>("preferredDeveloper");
      setPreferredDeveloperState(value || undefined);
    } catch (error) {
      console.error("Error loading preferred developer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setPreferredDeveloper = async (developer: string | undefined) => {
    try {
      if (developer) {
        await LocalStorage.setItem("preferredDeveloper", developer);
      } else {
        await LocalStorage.removeItem("preferredDeveloper");
      }
      setPreferredDeveloperState(developer);
    } catch (error) {
      console.error("Error saving preferred developer:", error);
    }
  };

  const developerOptions = [
    { title: "No Preference", value: "" },
    ...developers.map((dev) => ({
      title: `${dev.brand} ${dev.name}`,
      value: dev.name,
    })),
  ];

  return {
    preferredDeveloper,
    setPreferredDeveloper,
    isLoading,
    developerOptions,
  };
}
