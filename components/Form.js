"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";

const Form = () => {
  const [responseData, setResponseData] = useState({});
  const [loading, setLoading] = useState(false);
  const [resultHTML, setResultHTML] = useState("");
  const [summaryHTML, setSummaryHTML] = useState(""); // 🆕 for extracted table



  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setSummaryHTML(""); // reset previous summary
    try {
      const res = await fetch("https://rgpvresultextractor-backend-render.onrender.com/api/result", {
      // const res = await fetch("http://localhost:5000/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentNo: data.enrollmentNo,
          branch: data.branch,
          semester: data.semester,
        }),
      });

      const result = await res.json();
      setResponseData(result);
      setResultHTML(result.resultHTML || "");
      const beautified = beautifyResultHTML(result.resultHTML || "");
setResultHTML(beautified);


    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

 
  // 🆕 Extract Subject + Grade table (HORIZONTAL)
useEffect(() => {
  if (!resultHTML) return;

  const tempEl = document.createElement("div");
  tempEl.innerHTML = resultHTML;

  const tables = tempEl.querySelectorAll("table.gridtable");
  if (tables.length <= 1) return;

  let subjects = [];
  let grades = [];

  tables.forEach((table, idx) => {
    if (idx === 0) return;
    const tds = table.querySelectorAll("tr td");
    if (tds.length >= 4) {
      const subject = tds[0]?.innerText.trim();
      const grade = tds[3]?.innerText.trim();
      subjects.push(subject);
      grades.push(grade);
    }
  });

  // 🧩 Create a visually appealing summary table
  if (subjects.length > 0) {
    const tableHTML = `
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;
      font-family:'Segoe UI',sans-serif;border-radius:10px;overflow:hidden;
      box-shadow:0 4px 10px rgba(0,0,0,0.1);">
        <thead style="background:#2563eb;color:white;">
          <tr>
            ${subjects.map(s => `<th style="padding:7px;text-align:center;">${s}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          <tr style="background:#f8fafc;">
            ${grades.map(g => {
              let color = "#000";
              if (g === "A" || g === "A+") color = "green";
              else if (g === "B" || g === "B+") color = "#10b981";
              else if (g === "C" || g === "C+") color = "#facc15";
              else if (g === "F") color = "red";
              return `<td style="padding:7px;text-align:center;color:${color};
              font-weight:600;">${g}</td>`;
            }).join("")}
          </tr>
        </tbody>
      </table>
    `;
    setSummaryHTML(tableHTML);
  }
}, [resultHTML]);

// ✨ Clean and beautify RGPV's raw HTML result
const beautifyResultHTML = (rawHTML) => {
  if (!rawHTML) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHTML, "text/html");

  // 🎨 Style all tables
  doc.querySelectorAll("table").forEach((table) => {
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.margin = "10px 0";
    table.style.borderRadius = "10px";
    table.style.overflow = "hidden";
    table.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
    table.style.background = "white";
  });

  // 🎨 Style all table headers
  doc.querySelectorAll("th").forEach((th) => {
    th.style.background = "#2563eb";
    th.style.color = "white";
    th.style.padding = "10px";
    th.style.border = "1px solid #ddd";
    th.style.textAlign = "center";
    th.style.fontWeight = "600";
  });

  // 🎨 Style all table cells
  doc.querySelectorAll("td").forEach((td) => {
    td.style.padding = "5px";
    td.style.border = "1px solid #ddd";
    td.style.textAlign = "center";
    td.style.color = "#1e293b";
  });

  // 🎨 Headings
  doc.querySelectorAll("h2, h3, h4, h5").forEach((h) => {
    h.style.color = "#2563eb";
    h.style.textAlign = "center";
    h.style.marginTop = "8px";
  });

  // Remove ugly font tags
  doc.querySelectorAll("font").forEach((f) => {
    const span = document.createElement("span");
    span.innerHTML = f.innerHTML;
    f.replaceWith(span);
  });

  return doc.body.innerHTML;
};



  const copyToExcel = () => {
    if (!resultHTML) return alert("⚠️ No result data found!");

    const tempEl = document.createElement("div");
    tempEl.innerHTML = resultHTML;
    const table = tempEl.querySelector("table");

    if (table) {
      const range = document.createRange();
      range.selectNode(table);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");
      alert("✅ Table copied! Paste directly into Excel or Sheets.");
    } else {
      alert("⚠️ No table found in the result HTML!");
    }
  };

// 🆕 Copy only the summary table

// 🆕 Copy only the horizontal summary table
const copySummaryTable = () => {
  if (!summaryHTML) return alert("⚠️ No extracted summary found!");

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = summaryHTML;
  const table = tempDiv.querySelector("table");
  if (!table) return alert("⚠️ Summary table not found!");

  const range = document.createRange();
  range.selectNode(table);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  alert("✅ Summary table copied! Paste it into Excel or Google Sheets.");
};

// 🆕 Copy only grades (horizontal cells)
const copyGradesOnly = () => {
  if (!summaryHTML) return alert("⚠️ No summary found!");

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = summaryHTML;
  const gradeCells = Array.from(tempDiv.querySelectorAll("tbody td"));
  if (gradeCells.length === 0) return alert("⚠️ No grades found!");

  const gradeText = gradeCells.map(td => td.innerText.trim()).join("\t");
  navigator.clipboard.writeText(gradeText);
  alert("✅ Grades copied! Paste directly into Excel or Sheets.");
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
    // <div className="flex flex-col justify-center items-center min-h-[60vh] bg-gradient-to-r mt-10 from-slate-900 to-slate-800">
      <div className="flex flex-col items-center bg-gradient-to-r from-slate-900 to-slate-800 min-h-screen py-10">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row flex-wrap gap-4 bg-white px-6 py-5 rounded-2xl shadow-lg w-[90%] mt-24   sm:w-[70%] lg:w-[50%] items-center justify-center"
      >
        {/* Enrollment No */}
        <input
          type="text"
          placeholder="Enter Enrollment No."
          {...register("enrollmentNo", {
            required: "Enrollment number is required",
            minLength: { value: 12, message: "Must be 12 characters long" },
            maxLength: { value: 12, message: "Must be 12 characters long" },
          })}
          className={`border p-3 rounded-lg w-full sm:w-[60%] text-black focus:outline-none focus:ring-2 ${
            errors.enrollmentNo
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-blue-400"
          }`}
        />
        {errors.enrollmentNo && (
          <p className="text-red-500 text-sm">{errors.enrollmentNo.message}</p>
        )}

        {/* Select Branch */}
        <select
          {...register("branch", { required: "Branch selection is required" })}
          className={`border p-3 rounded-lg w-full sm:w-[40%] text-black focus:outline-none focus:ring-2 ${
            errors.branch
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-green-400"
          }`}
        >
          <option value="">Select Branch</option>
          <option value="BTech">B.Tech</option>
          <option value="BE">B.E.</option>
          <option value="MCA">M.C.A.</option>
          <option value="BPharmacy">B.Pharmacy</option>
          <option value="BPharmacyPCI">B.Pharmacy (PCI)</option>
          <option value="BArch">B.Arch.</option>
          <option value="MPharmacy">M.Pharmacy</option>
          <option value="ME">M.E.</option>
          <option value="MTech">M.Tech.</option>
          <option value="BEPTDC">B.E. (PTDC)</option>
        </select>

        {/* Select Semester */}
        <select
          {...register("semester", { required: "Semester is required" })}
          className={`border p-3 rounded-lg w-full sm:w-[30%] text-black focus:outline-none focus:ring-2 ${
            errors.semester
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-purple-400"
          }`}
        >
          <option value="">Select Semester</option>
          {[1,2,3,4,5,6,7,8].map((s) => (
            <option key={s} value={s}>{s} Semester</option>
          ))}
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold px-5 py-3 rounded-lg shadow-md transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            "Get Result"
          )}
        </button>
      </form>

      {/* Display Result */}
      {resultHTML && (
        
        <div className="w-[95%] sm:w-[80%] mt-8 bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">🎓 RGPV Result</h2>
            <div className="flex flex-wrap gap-3">
  <button
    onClick={copySummaryTable}
    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
  >
    📋 Copy Summary
  </button>

  <button
    onClick={copyGradesOnly}
    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
  >
    🧾 Copy Grades Only
  </button>

  <button
    onClick={copyToExcel}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
  >
    📋 Copy Full Table
  </button>

  <button
    onClick={downloadExcel}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
  >
    ⬇ Download Excel
  </button>
</div>

            {/* <div className="flex gap-3">
              <button
    onClick={copySummaryTable}
    className="bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700"
  >
    📋 Copy Summary
  </button>
              <button
                onClick={copyToExcel}
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              >
                📋 Copy to Excel
              </button>
              <button
                onClick={downloadExcel}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                ⬇ Download Excel
              </button>
            </div> */}
          </div>

          {/* 🆕 Summary Table */}
          {summaryHTML && (
            <div
              className="overflow-x-auto mb-6"
              dangerouslySetInnerHTML={{ __html: summaryHTML }}
            />
          )}

          {/* Full HTML Result */}
          <div
            className="overflow-x-auto text-sm"
            dangerouslySetInnerHTML={{ __html: resultHTML }}
          />
        </div>
      )}
    </div>
  );
};

export default Form;





