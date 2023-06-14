const map: Record<string, number> = {
  successful: 200,
  unauthorized: 401,
  invalidData: 400,
  notFound: 404,
  conflict: 409,
};

export default function mapStatusHTTP(status: string): number {
  return map[status] ?? 500;
}
