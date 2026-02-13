import { getBoatExpenseData } from '@/data/boat-expenses';
import BoatExpensesClient from './BoatExpensesClient';

export default function ExpensesPage() {
  const data = getBoatExpenseData();
  return <BoatExpensesClient data={JSON.parse(JSON.stringify(data))} />;
}
