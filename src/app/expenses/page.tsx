import { getExpenseData } from '@/data/expenses';
import ExpensesClient from './ExpensesClient';

export default function ExpensesPage() {
  const { expenses, total, totalExPurchase } = getExpenseData();
  return <ExpensesClient expenses={expenses} total={total} totalExPurchase={totalExPurchase} />;
}
