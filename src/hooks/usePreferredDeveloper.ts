import { useState, useEffect } from "react";
import { LocalStorage } from "@raycast/api";

export function usePreferredDeveloper() {
  const [preferredDeveloper, setPreferredDeveloperState] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load preferred developer from local storage on mount
    LocalStorage.getItem<string>("preferredDeveloper").then((value) => {
      setPreferredDeveloperState(value);
      setIsLoading(false);
    });
  }, []);

  const setPreferredDeveloper = async (developer: string | undefined) => {
    if (developer) {
      await LocalStorage.setItem("preferredDeveloper", developer);
    } else {
      await LocalStorage.removeItem("preferredDeveloper");
    }
    setPreferredDeveloperState(developer);
  };

  return {
    preferredDeveloper,
    setPreferredDeveloper,
    isLoading,
  };
} 