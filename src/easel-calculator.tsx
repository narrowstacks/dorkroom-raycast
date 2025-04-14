import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { TemplateList } from "./components/border-calculator";
import { TemplateForm } from "./components/border-calculator/TemplateForm";

export default function Command() {
  return <TemplateList />;
}
