export interface BilingualText {
    en: string;
    ar: string;
}

export interface BilingualOptions {
    en: string[];
    ar: string[];
}

export const ensureBilingual = (value: any): BilingualText => {
  if (!value) return { en: "", ar: "" };
  if (typeof value === "object" && value !== null) {
    const enVal = value.en || "";
    const arVal = value.ar || "";
    const resolvedEn = typeof enVal === "string" && enVal.startsWith("{") ? ensureBilingual(enVal).en : enVal;
    const resolvedAr = typeof arVal === "string" && arVal.startsWith("{") ? ensureBilingual(arVal).ar : arVal;
    return { en: resolvedEn || "", ar: resolvedAr || "" };
  }
  if (typeof value === "string") {
    try {
      if (value.startsWith("{")) {
        const parsed = JSON.parse(value);
        return ensureBilingual(parsed);
      }
    } catch (e) {}
    return { en: value, ar: value };
  }
  return { en: "", ar: "" };
};

export const ensureBilingualOptions = (value: any): BilingualOptions => {
  if (!value) return { en: [], ar: [] };
  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      return { en: value, ar: value };
    }
    const enVal = value.en || [];
    const arVal = value.ar || [];
    const resolvedEn = typeof enVal === "string" && (enVal.startsWith("{") || enVal.startsWith("[")) ? ensureBilingualOptions(enVal).en : enVal;
    const resolvedAr = typeof arVal === "string" && (arVal.startsWith("{") || arVal.startsWith("[")) ? ensureBilingualOptions(arVal).ar : arVal;
    return { en: Array.isArray(resolvedEn) ? resolvedEn : [], ar: Array.isArray(resolvedAr) ? resolvedAr : [] };
  }
  if (typeof value === "string") {
    try {
      if (value.startsWith("{") || value.startsWith("[")) {
        const parsed = JSON.parse(value);
        return ensureBilingualOptions(parsed);
      }
    } catch (e) {}
  }
  return { en: [], ar: [] };
};
