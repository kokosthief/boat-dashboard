import { getExpenseData } from '@/data/expenses';
import ExpensesClient from './ExpensesClient';

export default function ExpensesPage() {
  const data = getExpenseData();
  return <ExpensesClient data={JSON.parse(JSON.stringify(data))} />;
}
