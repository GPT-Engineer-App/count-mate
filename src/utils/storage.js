export const loadCounts = () => {
  const savedCounts = localStorage.getItem("cumulativeTally");
  return savedCounts ? JSON.parse(savedCounts) : { PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 };
};

export const saveCounts = (counts) => {
  localStorage.setItem("cumulativeTally", JSON.stringify(counts));
};
