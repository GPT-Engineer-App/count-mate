import React from "react";
import { Button } from "@chakra-ui/react";

const CSVDownloader = ({ data }) => {
  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," + data.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const date = new Date();
    const dateString = `${date.getDate()}-${date.getMonth() + 1}`;
    const downloadCount = parseInt(localStorage.getItem(dateString) || "0", 10) + 1;
    localStorage.setItem(dateString, downloadCount.toString());
    link.setAttribute("download", `${dateString}-CDS_Count-${downloadCount}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={handleDownload} colorScheme="blue">
      Download CSV
    </Button>
  );
};

export default CSVDownloader;
