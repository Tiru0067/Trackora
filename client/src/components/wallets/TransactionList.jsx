import TransactionsContext from "../../context/TransactionsContext";
import { useContext } from "react";
import { format, isToday, isYesterday } from "date-fns";
import TransactionItem from "./TransactionItem";

const TransactionList = () => {
  const { transactions } = useContext(TransactionsContext);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    return format(date, "MMM dd, yyyy");
  };

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const grouped = sorted.reduce((acc, txn) => {
    const datekey = formatDate(txn.date);

    if (!acc[datekey]) {
      acc[datekey] = [];
    }

    acc[datekey].push(txn);
    return acc;
  }, {});

  console.log(grouped);

  return (
    <div className="flex flex-col gap-2 overflow-y-auto hide-scrollbar">
      {Object.entries(grouped).map(([date, txns]) => (
        <div key={date}>
          <h1 className="text-sm font-medium text-neutral-500 mb-2">{date}</h1>
          <ul className="flex flex-col gap-2">
            {txns.map((t) => (
              <TransactionItem key={t.id} txn={t} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
