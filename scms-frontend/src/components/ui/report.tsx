import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, BarChart2, Download, MessageCircle } from "lucide-react";
import jsPDF from "jspdf";

const generateFakeDayReport = () => {
  const moisture = (40 + Math.random() * 30).toFixed(1);
  const temperature = (24 + Math.random() * 8).toFixed(1);
  const growth = (1 + Math.random() * 3).toFixed(1);
  const pests = Math.random() > 0.8 ? "Mild pest activity" : "No issues";
  const fertilizerUsed = Math.random() > 0.6 ? "Yes" : "No";

  return { moisture, temperature, growth, pests, fertilizerUsed };
};

export default function Resport() {
  const [report, setReport] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const [showButtons, setShowButtons] = useState(false); // ⭐ NEW STATE

  const generateReport = async () => {
    setShowButtons(true); // ⭐ SHOW BUTTONS IMMEDIATELY

    if (report.length > 0) {
      setReport([]);
      return;
    }

    try {
      await fetch("http://localhost:3001/send");
    } catch (err) {
      console.error("Backend request failed:", err);
    }

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const rawReport = days.map((day) => ({
      day,
      data: generateFakeDayReport(),
    }));

    const sortedGrowth = rawReport
      .map((r) => parseFloat(r.data.growth))
      .sort((a, b) => a - b);

    const finalReport = rawReport.map((item, index) => ({
      ...item,
      data: {
        ...item.data,
        growth: sortedGrowth[index].toFixed(1),
      }
    }));

    setReport(finalReport);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text("Weekly Field Report", 10, 10);
    let y = 20;

    report.forEach((entry: any) => {
      pdf.setFontSize(13);
      pdf.text(`${entry.day}`, 10, y);
      y += 6;

      pdf.setFontSize(11);
      pdf.text(`Growth: ${entry.data.growth} cm`, 12, y); y += 5;
      pdf.text(`Soil Moisture: ${entry.data.moisture}%`, 12, y); y += 5;
      pdf.text(`Temperature: ${entry.data.temperature}°C`, 12, y); y += 5;
      pdf.text(`Pest Status: ${entry.data.pests}`, 12, y); y += 5;
      pdf.text(`Fertilizer Used: ${entry.data.fertilizerUsed}`, 12, y); y += 8;
    });

    pdf.save("Weekly_Field_Report.pdf");
  };

  const shareWhatsApp = async () => {
    if (report.length === 0) return;

    const message = report
      .map(
        (r) => `
${r.day}
🌱 Growth: ${r.data.growth} cm
💧 Soil Moisture: ${r.data.moisture}%
🌡 Temperature: ${r.data.temperature}°C
🐛 Pest Status: ${r.data.pests}
🧪 Fertilizer Used: ${r.data.fertilizerUsed}
`
      )
      .join("\n");

    try {
      const res = await fetch("http://localhost:3001/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      console.log("WhatsApp Sent:", await res.json());
      alert("WhatsApp message sent!");
    } catch (err) {
      console.error("WhatsApp Error:", err);
      alert("Failed to send WhatsApp");
    }
  };

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart2 className="h-5 w-5 text-primary" />
            Weekly Field Report
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button className="bg-gradient-primary w-full" onClick={generateReport}>
            {report.length > 0 ? "Close Report" : "Generate Report (7 Days)"}
          </Button>

          {success && (
            <div className="flex items-center gap-2 text-green-600 font-medium bg-green-100 p-3 rounded-md">
              <CheckCircle className="h-5 w-5" />
              Report generated successfully!
            </div>
          )}

          {/* ⭐ BUTTONS SHOW WHEN showButtons = true */}
          {showButtons && (
            <div className="flex gap-3">
              <Button className="flex-1" onClick={downloadPDF}>
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>

              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={shareWhatsApp}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          )}

          {report.length > 0 && (
            <div className="mt-6 space-y-6 text-[15px] leading-relaxed">
              {report.map((entry, idx) => (
                <div key={idx} className="border-b pb-4">
                  <h2 className="text-lg font-semibold mb-2">{entry.day}</h2>

                  <p>🌱 <strong>Growth:</strong> {entry.data.growth} cm</p>
                  <p>💧 <strong>Soil Moisture:</strong> {entry.data.moisture}%</p>
                  <p>🌡 <strong>Temperature:</strong> {entry.data.temperature}°C</p>
                  <p>🐛 <strong>Pest Status:</strong> {entry.data.pests}</p>
                  <p>🧪 <strong>Fertilizer Used:</strong> {entry.data.fertilizerUsed}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
