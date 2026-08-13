const CategoryStats = ({
  totalCategories,
  activeCategories,
  unusedCategories,
}) => {
  return (
    <section
      aria-label="Category Statistics"
      className="mt-4 sm:mt-6 p-4 bg-(--bg-card) border border-(--line) rounded-xl text-sm font-medium text-(--ink)"
    >
      <table className="max-md:w-full w-lg table-fixed">
        <tbody>
          <tr className="text-(--ink-soft) text-xs text-left">
            <th className="font-medium pr-6">Total</th>
            <th className="font-medium px-6 border-l border-(--line)">
              Active
            </th>
            <th className="font-medium pl-6 border-l border-(--line)">
              Unused
            </th>
          </tr>
          <tr>
            <td className="pt-1 pr-6">{totalCategories}</td>
            <td className="pt-1 px-6 border-l border-(--line)">
              {activeCategories}
            </td>
            <td className="pt-1 pl-6 border-l border-(--line)">
              {unusedCategories}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default CategoryStats;
