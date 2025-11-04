"use client";
import React from "react";
import * as XLSX from "xlsx";

const ResultDisplay = ({ resultHTML, summaryHTML }) => {
  if (!resultHTML) return null;

  // --- Copy Functions ---
  const copyToExcel = () => {
    if (!resultHTML) return alert("⚠️ No result data found!");
    const tempEl = document.createElement("div");
    tempEl.innerHTML = resultHTML;
    const table = tempEl.querySelector("table");
    if (!table) return alert("⚠️ No table found!");

    const range = document.createRange();
    range.selectNode(table);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    alert("✅ Table copied! Paste directly into Excel or Sheets.");
  };

  const copySummaryTable = () => {
    if (!summaryHTML) return alert("⚠️ No summary found!");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = summaryHTML;
    const table = tempDiv.querySelector("table");
    if (!table) return alert("⚠️ Summary table not found!");

    const range = document.createRange();
    range.selectNode(table);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    alert("✅ Summary table copied!");
  };

  const copyGradesOnly = () => {
    if (!summaryHTML) return alert("⚠️ No summary found!");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = summaryHTML;
    const gradeCells = Array.from(tempDiv.querySelectorAll("tbody td"));
    if (gradeCells.length === 0) return alert("⚠️ No grades found!");
    const gradeText = gradeCells.map((td) => td.innerText.trim()).join("\t");
    navigator.clipboard.writeText(gradeText);
   
  };

  const downloadExcel = () => {
    if (!resultHTML) return alert("⚠️ No data to export!");
    const tempEl = document.createElement("div");
    tempEl.innerHTML = resultHTML;
    const table = tempEl.querySelector("table");
    if (!table) return alert("No table found!");
    const workbook = XLSX.utils.table_to_book(table);
    XLSX.writeFile(workbook, "RGPV_Result.xlsx");
  };

  return (
    <div className="w-[95%] sm:w-[80%] mt-8 bg-white rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">🎓 RGPV Result</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={copySummaryTable}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-all"
          >
            📋 Copy Summary
          </button>
          <button
            onClick={copyGradesOnly}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-all"
          >
            🧾 Copy Grades
          </button>
          <button
            onClick={copyToExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-all"
          >
            📋 Copy Full
          </button>
          <button
            onClick={downloadExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-all"
          >
            ⬇ Download Excel
          </button>
        </div>
      </div>

      {summaryHTML && (
        <div
          className="overflow-x-auto mb-6"
          dangerouslySetInnerHTML={{ __html: summaryHTML }}
        />
      )}

      <div
        className="overflow-x-auto text-sm"
        dangerouslySetInnerHTML={{ __html: resultHTML }}
      />
    </div>
  );
};

export default ResultDisplay;
