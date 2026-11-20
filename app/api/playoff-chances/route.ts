import { getPlayoffForecast } from '@/lib/data/playoff-chances';
export async function GET() {
  return Response.json(await getPlayoffForecast(), {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  });
}
