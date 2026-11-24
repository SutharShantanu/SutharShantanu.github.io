import { useEffect, useState, type JSX } from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";

// Fetched SVG text, shared across renders/tabs.
const cache = new Map<string, Promise<string | null>>();

/**
 * react-native-svg aborts natively on blend modes it can't map (feBlend / mix-blend-mode
 * "overlay" in the VS Code logo), so filters and blend modes are stripped. They're only soft glows.
 */
const sanitize = (xml: string) =>
  xml
    .replace(/<filter[\s\S]*?<\/filter>/g, "")
    .replace(/\sfilter="[^"]*"/g, "")
    .replace(/mix-blend-mode\s*:\s*[^;"]*;?/g, "")
    .replace(/\smix-blend-mode="[^"]*"/g, "")
    .replace(/<title>[\s\S]*?<\/title>/g, "");

function load(uri: string) {
  if (!cache.has(uri)) {
    cache.set(
      uri,
      fetch(uri)
        .then((r) => (r.ok ? r.text() : null))
        .then((t) => (t ? sanitize(t) : null))
        .catch(() => null)
    );
  }
  return cache.get(uri)!;
}

export function BrandLogo({ uri, size = 26 }: { uri: string; size?: number }): JSX.Element {
  const [xml, setXml] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    load(uri).then((x) => alive && setXml(x));
    return () => {
      alive = false;
    };
  }, [uri]);
  return xml ? <SvgXml xml={xml} width={size} height={size} /> : <View style={{ width: size, height: size }} />;
}
