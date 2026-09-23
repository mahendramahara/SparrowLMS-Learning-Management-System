export default function InstructorTransactionsTable({ transactions = [] }) {
  return (
    <div
      className="rounded-2xl border p-6 space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
        Recent Transactions
      </h2>

      <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
        {transactions.length === 0 ? (
          <div className="py-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            No sales transactions yet. Once students enroll in your paid courses, your earnings will appear here.
          </div>
        ) : (
          transactions.map(item => (
            <div key={item.id} className="flex items-center justify-between py-3 text-xs">
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {item.desc}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {item.studentName ? `Student: ${item.studentName} • ` : ''}{item.date}
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-500">{item.amount}</span>
                <p className="text-[10px] font-medium text-emerald-600">{item.status}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
