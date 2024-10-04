import { fillHTMLTemplate } from "../../scripts/utils/html-template-util";
import template from "./index.html" with { type: "text" };

export function errorHTML(error: string): string {
  return fillHTMLTemplate(template, { error });
}
