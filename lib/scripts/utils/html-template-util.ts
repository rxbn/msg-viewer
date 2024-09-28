/**
 * Fills an HTML template with object values in place of {{object.key}}
 */
export function fillHTMLTemplate<T>(html: string, obj: T): string {
  return html.replace(/{{(.*?)}}/g, (_m: string, key: string) => {
    return obj[key.trim() as keyof typeof obj] as string;
  })
}