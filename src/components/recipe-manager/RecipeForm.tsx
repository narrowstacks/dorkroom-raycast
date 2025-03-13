import { ActionPanel, Action, Icon, showToast, Toast, Form, useNavigation, getPreferenceValues } from "@raycast/api";
import { useEffect, useState } from "react";
import { Recipe } from "../../types/recipe";
import { Film } from "../../types/film";
import { getCachedFilms } from "../../lib/films";
import developersData from "../../data/developers.json";
import { normalizeNames } from "../../lib/search";
import { RECIPE_STRINGS } from "../../constants/strings";
import { celsiusToFahrenheit, fahrenheitToCelsius } from "../../utils/temperature";

interface Preferences {
  tempUnit: "C" | "F";
}

interface RecipeFormProps {
  recipe?: Recipe;
  onSave: (recipe: Recipe) => void;
}

// Helper function to get films
async function getFilmOptions(): Promise<Film[]> {
  try {
    const rawFilms = await getCachedFilms();
    return (rawFilms as Film[]).map(normalizeNames).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error loading films:", error);
    return [];
  }
}

// Helper function to get developers
function getDeveloperOptions() {
  return developersData.developers.sort((a, b) => a.name.localeCompare(b.name));
}

export function RecipeForm({ recipe, onSave }: RecipeFormProps) {
  const { pop } = useNavigation();
  const { tempUnit } = getPreferenceValues<Preferences>();
  const [films, setFilms] = useState<Film[]>([]);
  const [developers, setDevelopers] = useState<typeof developersData.developers>([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState<(typeof developers)[0] | undefined>(undefined);
  const [customFilm, setCustomFilm] = useState(false);
  const [customDeveloper, setCustomDeveloper] = useState(false);
  const [customDilution, setCustomDilution] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Form field values
  const [isoValue, setIsoValue] = useState<string>(recipe?.iso?.toString() || "");
  const [userModifiedIso, setUserModifiedIso] = useState(false);
  const [selectedFilmName, setSelectedFilmName] = useState<string>(recipe?.filmName || "");
  const [customFilmName, setCustomFilmName] = useState<string>(recipe?.filmName || "");
  const [selectedDeveloperName, setSelectedDeveloperName] = useState<string>(recipe?.developerName || "");
  const [customDeveloperName, setCustomDeveloperName] = useState<string>(recipe?.developerName || "");
  const [selectedDilution, setSelectedDilution] = useState<string>(recipe?.dilution || "");
  const [customDilutionValue, setCustomDilutionValue] = useState<string>(recipe?.dilution || "");

  // Load films and developers on mount
  useEffect(() => {
    getFilmOptions().then(setFilms);
    setDevelopers(getDeveloperOptions());
  }, []);

  // Update dilution options when developer changes
  useEffect(() => {
    if (recipe?.developerName) {
      const dev = developers.find((d) => d.name === recipe.developerName);
      setSelectedDeveloper(dev);
      if (!dev) {
        setCustomDeveloper(true);
        setCustomDeveloperName(recipe.developerName);
      } else {
        setSelectedDeveloperName(recipe.developerName);
      }
    }
  }, [developers, recipe]);

  // Check if film exists in list
  useEffect(() => {
    if (recipe?.filmName) {
      const filmExists = films.some((f) => f.name === recipe.filmName);
      if (!filmExists) {
        setCustomFilm(true);
        setCustomFilmName(recipe.filmName);
      } else {
        setSelectedFilmName(recipe.filmName);
      }
    }
  }, [films, recipe]);

  // Update dilution state when recipe changes
  useEffect(() => {
    if (recipe?.dilution) {
      if (selectedDeveloper) {
        const dilutionExists = selectedDeveloper.commonDilutions.some((d) => d.ratio === recipe.dilution);
        if (!dilutionExists) {
          setCustomDilution(true);
          setCustomDilutionValue(recipe.dilution);
        } else {
          setSelectedDilution(recipe.dilution);
        }
      } else {
        setCustomDilution(true);
        setCustomDilutionValue(recipe.dilution);
      }
    }
  }, [selectedDeveloper, recipe]);

  const handleFilmSelect = (newValue: string) => {
    if (newValue === "custom") {
      setCustomFilm(true);
      setSelectedFilmName("");
    } else {
      setCustomFilm(false);
      setSelectedFilmName(newValue);

      // If this is a real film selection (not custom) and the user hasn't modified the ISO,
      // populate the ISO field with the film's base ISO
      const selectedFilm = films.find((film) => film.name === newValue);
      if (selectedFilm && !userModifiedIso) {
        setIsoValue(selectedFilm.iso.toString());
      }
    }
  };

  const handleDeveloperSelect = (newValue: string) => {
    if (newValue === "custom") {
      setCustomDeveloper(true);
      setSelectedDeveloperName("");
      setSelectedDeveloper(undefined);
    } else {
      setCustomDeveloper(false);
      setSelectedDeveloperName(newValue);
      const dev = developers.find((d) => d.name === newValue);
      setSelectedDeveloper(dev);

      // Reset dilution when developer changes
      setSelectedDilution("");
      setCustomDilution(false);
    }
  };

  const handleDilutionSelect = (newValue: string) => {
    if (newValue === "custom") {
      setCustomDilution(true);
      setSelectedDilution("");
    } else {
      setCustomDilution(false);
      setSelectedDilution(newValue);
    }
  };

  async function handleSubmit(values: any) {
    // Get the film name from either selected film or custom input
    const filmName = customFilm ? customFilmName : selectedFilmName;

    // Get the developer name from either selected developer or custom input
    const developerName = customDeveloper ? customDeveloperName : selectedDeveloperName;

    // Get the dilution from either selected dilution or custom input
    const dilution = customDilution || !selectedDeveloper ? customDilutionValue : selectedDilution;

    // Validate required fields
    if (!filmName) {
      setError(RECIPE_STRINGS.FORM.VALIDATION.FILM_REQUIRED);
      return;
    }
    if (!developerName) {
      setError(RECIPE_STRINGS.FORM.VALIDATION.DEVELOPER_REQUIRED);
      return;
    }
    if (!dilution) {
      setError(RECIPE_STRINGS.FORM.VALIDATION.DILUTION_REQUIRED);
      return;
    }
    if (!isoValue || isNaN(parseInt(isoValue))) {
      setError(RECIPE_STRINGS.FORM.VALIDATION.ISO_REQUIRED);
      return;
    }
    if (!values.duration || isNaN(parseInt(values.duration)) || parseInt(values.duration) <= 0) {
      setError(RECIPE_STRINGS.FORM.VALIDATION.DURATION_REQUIRED);
      return;
    }
    if (!values.temperature || isNaN(parseFloat(values.temperature))) {
      setError(RECIPE_STRINGS.FORM.VALIDATION.TEMPERATURE_REQUIRED);
      return;
    }
    if (!values.pushPull || isNaN(parseInt(values.pushPull))) {
      setError(RECIPE_STRINGS.FORM.VALIDATION.PUSH_PULL_REQUIRED);
      return;
    }

    // Convert temperature based on user's preferred unit
    const temperatureC =
      tempUnit === "C" ? parseFloat(values.temperature) : fahrenheitToCelsius(parseFloat(values.temperature));

    const temperatureF =
      tempUnit === "F" ? parseFloat(values.temperature) : celsiusToFahrenheit(parseFloat(values.temperature));

    // Selected film
    const selectedFilm = films.find((film) => film.name === selectedFilmName);

    const newRecipe: Recipe = {
      id: recipe?.id || `user_${Date.now()}`,
      filmId: selectedFilm?._id || "",
      filmName: filmName,
      developerId: "",
      developerName: developerName,
      dilution: dilution,
      iso: parseInt(isoValue),
      pushPull: parseInt(values.pushPull),
      steps: [
        {
          name: "Development",
          duration: parseInt(values.duration) * 60,
          temperatureC,
          temperatureF,
          notes: values.agitation,
        },
      ],
      notes: values.notes,
      source: "user",
      dateAdded: recipe?.dateAdded || new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    await onSave(newRecipe);
    await showToast({ title: RECIPE_STRINGS.FORM.SUCCESS.SAVE, style: Toast.Style.Success });
    pop();
  }

  // Get the appropriate temperature value based on user's preference
  const defaultTemp = recipe?.steps[0]
    ? tempUnit === "C"
      ? recipe.steps[0].temperatureC
      : recipe.steps[0].temperatureF
    : tempUnit === "C"
      ? 20
      : 68;

  return (
    <Form
      navigationTitle={recipe ? RECIPE_STRINGS.COMMON.EDIT : RECIPE_STRINGS.COMMON.CREATE}
      actions={
        <ActionPanel>
          <Action.SubmitForm title={RECIPE_STRINGS.COMMON.SAVE} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Dropdown
        id="filmSelect"
        title={RECIPE_STRINGS.FORM.FIELDS.FILM}
        value={customFilm ? "custom" : selectedFilmName}
        onChange={handleFilmSelect}
      >
        {films.map((film) => (
          <Form.Dropdown.Item
            key={film._id}
            value={film.name}
            title={`${film.brand ? `${film.brand} ` : ""}${film.name}`}
          />
        ))}
        <Form.Dropdown.Item key="custom" value="custom" title={RECIPE_STRINGS.FORM.CUSTOM.FILM} icon={Icon.Plus} />
      </Form.Dropdown>

      {customFilm && (
        <Form.TextField
          id="filmName"
          title={RECIPE_STRINGS.FORM.FIELDS.FILM_NAME}
          placeholder={RECIPE_STRINGS.FORM.PLACEHOLDERS.FILM_NAME}
          value={customFilmName}
          onChange={setCustomFilmName}
        />
      )}

      <Form.Dropdown
        id="developerSelect"
        title={RECIPE_STRINGS.FORM.FIELDS.DEVELOPER}
        value={customDeveloper ? "custom" : selectedDeveloperName}
        onChange={handleDeveloperSelect}
      >
        {developers.map((dev) => (
          <Form.Dropdown.Item key={dev.name} value={dev.name} title={`${dev.brand} ${dev.name}`} />
        ))}
        <Form.Dropdown.Item key="custom" value="custom" title={RECIPE_STRINGS.FORM.CUSTOM.DEVELOPER} icon={Icon.Plus} />
      </Form.Dropdown>

      {customDeveloper && (
        <Form.TextField
          id="developerName"
          title={RECIPE_STRINGS.FORM.FIELDS.DEVELOPER_NAME}
          placeholder={RECIPE_STRINGS.FORM.PLACEHOLDERS.DEVELOPER_NAME}
          value={customDeveloperName}
          onChange={setCustomDeveloperName}
        />
      )}

      {selectedDeveloper && (
        <Form.Dropdown
          id="dilutionSelect"
          title={RECIPE_STRINGS.FORM.FIELDS.DILUTION}
          value={customDilution ? "custom" : selectedDilution}
          onChange={handleDilutionSelect}
        >
          {selectedDeveloper.commonDilutions.map((dilution) => (
            <Form.Dropdown.Item
              key={dilution.ratio}
              value={dilution.ratio}
              title={`${dilution.name} (${dilution.ratio}) - ${dilution.description}`}
            />
          ))}
          <Form.Dropdown.Item
            key="custom"
            value="custom"
            title={RECIPE_STRINGS.FORM.CUSTOM.DILUTION}
            icon={Icon.Plus}
          />
        </Form.Dropdown>
      )}

      {(customDilution || !selectedDeveloper) && (
        <Form.TextField
          id="dilution"
          title={RECIPE_STRINGS.FORM.FIELDS.DILUTION}
          placeholder={RECIPE_STRINGS.FORM.PLACEHOLDERS.DILUTION}
          value={customDilutionValue}
          onChange={setCustomDilutionValue}
        />
      )}

      <Form.TextField
        id="iso"
        title={RECIPE_STRINGS.FORM.FIELDS.ISO}
        placeholder={RECIPE_STRINGS.FORM.PLACEHOLDERS.ISO}
        value={isoValue}
        onChange={(newValue) => {
          setIsoValue(newValue);
          setUserModifiedIso(true);
        }}
      />

      <Form.TextField
        id="pushPull"
        title={RECIPE_STRINGS.FORM.FIELDS.PUSH_PULL}
        placeholder={RECIPE_STRINGS.FORM.PLACEHOLDERS.PUSH_PULL}
        defaultValue={recipe?.pushPull?.toString() || "0"}
      />

      <Form.TextField
        id="duration"
        title={RECIPE_STRINGS.FORM.FIELDS.DURATION}
        placeholder={RECIPE_STRINGS.FORM.PLACEHOLDERS.DURATION}
        defaultValue={recipe ? (recipe.steps[0].duration / 60).toString() : ""}
      />

      <Form.TextField
        id="temperature"
        title={RECIPE_STRINGS.FORM.FIELDS.TEMPERATURE(RECIPE_STRINGS.FORM.TEMPERATURE_UNIT[tempUnit])}
        placeholder={RECIPE_STRINGS.FORM.PLACEHOLDERS.TEMPERATURE(RECIPE_STRINGS.FORM.TEMPERATURE_UNIT[tempUnit])}
        defaultValue={defaultTemp?.toString()}
      />

      <Form.TextArea
        id="agitation"
        title={RECIPE_STRINGS.FORM.FIELDS.AGITATION}
        placeholder={RECIPE_STRINGS.FORM.PLACEHOLDERS.AGITATION}
        defaultValue={recipe?.steps[0].notes}
      />

      <Form.TextArea
        id="notes"
        title={RECIPE_STRINGS.FORM.FIELDS.NOTES}
        placeholder={RECIPE_STRINGS.FORM.PLACEHOLDERS.NOTES}
        defaultValue={recipe?.notes}
      />
    </Form>
  );
}
