function StatCard({ title, value }) {
  return (
    <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6">

      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-2">
        {value}
      </h2>

    </div>
  );
}

export default StatCard;