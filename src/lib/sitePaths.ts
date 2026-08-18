const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBasePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${basePath}${path}` || "/";
}

export function withoutBasePath(pathname: string): string {
  if (!basePath || !pathname.startsWith(basePath)) return pathname;
  return pathname.slice(basePath.length) || "/";
}
