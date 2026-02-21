import { getBoatExpenseData } from '@/data/boat-expenses';
import BoatExpensesClient from './BoatExpensesClient';

export const dynamic = 'force-dynamic';

export default async function ExpensesPage() {
  const data = await getBoatExpenseData();
  return <BoatExpensesClient data={JSON.parse(JSON.stringify(data))} />;
}
