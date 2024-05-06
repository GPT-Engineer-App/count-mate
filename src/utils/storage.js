export const loadCounts = () => {
  const savedCounts = localStorage.getItem("cumulativeTally");
  return savedCounts ? JSON.parse(savedCounts) : { pet: 0, hdp: 0, can: 0, glass: 0, carton: 0 };
};

export const saveCounts = (counts) => {
  localStorage.setItem("cumulativeTally", JSON.stringify(counts));
};
