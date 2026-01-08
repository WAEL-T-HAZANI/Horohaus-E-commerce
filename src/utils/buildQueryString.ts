export interface QueryParams {
  [key: string]: string | string[] | number | undefined | null;
}

export function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) searchParams.append(key, String(v));
      });
    } else {
      searchParams.set(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function parseQueryString(search: string): Record<string, string | string[]> {
  const params = new URLSearchParams(search);
  const result: Record<string, string | string[]> = {};
  
  params.forEach((value, key) => {
    if (result[key]) {
      const existing = result[key];
      result[key] = Array.isArray(existing) 
        ? [...existing, value]
        : [existing as string, value];
    } else {
      result[key] = value;
    }
  });
  
  return result;
}

