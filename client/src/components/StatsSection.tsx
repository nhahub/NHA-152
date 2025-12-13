const StatsSection = () => {
  const stats = [
    { value: "234+", label: "Fundraisers" },
    { value: "$56M+", label: "Raised" },
    { value: "234k+", label: "Donations" },
    { value: "160,527+", label: "Volunteers" },
  ];

  return (
    <div className="bg-card py-16 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
