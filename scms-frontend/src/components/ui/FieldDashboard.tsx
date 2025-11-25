import React from "react";
import { useNavigate } from "react-router-dom";

// ── Crop Images ────────────────────────────────────────────────────────
import CorianderImg from "@/assets//coriander.jpg";
import GreengramImg from "@/assets//greengram.jpg";
import RiceImg from "@/assets//rice.jpg";
import WheatImg from "@/assets/wheat.jpg";

// ── All CSS in One String ──────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }

  .dashboard {
    min-height: 100vh;
    background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
    padding: 2rem 1rem;
  }

  /* Top Stats Dashboard */
  .top-dashboard {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto 2.5rem auto;
  }
  .stat-card {
    background: white;
    border-radius: 1rem;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    min-width: 160px;
    text-align: center;
    transition: transform 0.2s ease;
  }
  .stat-card:hover {
    transform: translateY(-4px);
  }
  .stat-label {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }
  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #16a34a;
    margin-top: 0.25rem;
  }

  /* Field Grid */
  .grid {
    display: grid;
    gap: 1.75rem;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    max-width: 1200px;
    margin: 0 auto;
  }

  .card {
    position: relative;
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
    cursor: pointer;
  }
  .card:hover {
    transform: translateY(-6px);
  }

  .bg-img {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: brightness(0.6);
  }

  .overlay {
    position: relative;
    padding: 1.5rem;
    color: white;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .field-name {
    font-size: 1.75rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }

  .crop-name {
    font-size: 1.125rem;
    font-weight: 600;
    text-align: center;
    margin: 0.5rem 0;
    background: rgba(0,0,0,0.4);
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    display: inline-block;
    align-self: center;
    backdrop-filter: blur(3px);
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.35rem 0.75rem;
    border-radius: 1.5rem;
  }
  .status-green { background: #16a34a; }
  .status-yellow { background: #ca8a04; }
  .status-red { background: #dc2626; }

  .moisture {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    margin: 0.75rem 0;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    opacity: 0.9;
  }

  .live-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
  }

  .live-dot {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
  }

  .pulse {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: #22c55e;
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .pulse-warning { background: #eab308; }
  .pulse-critical { background: #ef4444; }

  .field-id {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 0.375rem;
  }

  .buttons {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .btn {
    flex: 1;
    padding: 0.65rem;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
    transition: background 0.2s;
  }
  .btn-secondary {
    background: rgba(255,255,255,0.25);
    border: 1px solid rgba(255,255,255,0.35);
    color: white;
  }
  .btn-secondary:hover {
    background: rgba(255,255,255,0.35);
  }
  .btn-primary {
    background: #16a34a;
    color: white;
  }
  .btn-primary:hover {
    background: #15803d;
  }

  @media (min-width: 768px) {
    .grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

// ── Field Data ────────────────────────────────────────────────────────
interface Field {
  id: string;
  name: string;
  crop: string;
  status: "Irrigated" | "Optimal" | "Dry";
  moisture: string;
  lastIrrigated: string;
  health: "Healthy" | "Warning" | "Critical";
  bgImg: string;
}

const fields: Field[] = [
  {
    id: "A",
    name: "Field A",
    crop: "Coriander",
    status: "Irrigated",
    moisture: "72%",
    lastIrrigated: "2 hours ago",
    health: "Healthy",
    bgImg: CorianderImg,
  },
  {
    id: "B",
    name: "Field B",
    crop: "Green Gram",
    status: "Irrigated",
    moisture: "68%",
    lastIrrigated: "4 hours ago",
    health: "Healthy",
    bgImg: GreengramImg,
  },
  {
    id: "C",
    name: "Field C",
    crop: "Rice",
    status: "Optimal",
    moisture: "55%",
    lastIrrigated: "Yesterday",
    health: "Warning",
    bgImg: RiceImg,
  },
  {
    id: "D",
    name: "Field D",
    crop: "Wheat",
    status: "Dry",
    moisture: "32%",
    lastIrrigated: "3 days ago",
    health: "Critical",
    bgImg: WheatImg,
  },
];

export default function FieldDashboard() {
  const navigate = useNavigate();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="dashboard">

        {/* Top Dashboard */}
        

        {/* Field Cards */}
        <div className="grid">
          {fields.map((field) => {
            const statusCls =
              field.status === "Irrigated"
                ? "status-green"
                : field.status === "Optimal"
                ? "status-yellow"
                : "status-red";

            const pulseCls =
              field.health === "Healthy"
                ? ""
                : field.health === "Warning"
                ? "pulse-warning"
                : "pulse-critical";

            return (
              <div key={field.id} className="card">
                <div
                  className="bg-img"
                  style={{ backgroundImage: `url(${field.bgImg})` }}
                />
                <div className="overlay">
                  <div className="header-row">
                    <div className="field-name">{field.name}</div>
                    <div className={`status-badge ${statusCls}`}>
                      {field.status}
                    </div>
                  </div>

                  <div className="crop-name">{field.crop}</div>

                  <div className="moisture">
                    Moisture: {field.moisture}
                  </div>

                  <div className="info-row">
                    <span>Last Irrigated</span>
                    <span>{field.lastIrrigated}</span>
                  </div>

                  <div className="info-row">
                    <span>Health Status</span>
                    <span>{field.health}</span>
                  </div>

                  <div className="live-container">
                    <div className="live-dot">
                      <div className={`pulse ${pulseCls}`} />
                      Live
                    </div>
                    <div className="field-id">{field.id}</div>
                  </div>

                  <div className="buttons">
                    <div className="btn btn-secondary" onClick={() => navigate(`/field-detail/${field.id.toLowerCase()}`)}>View Details</div>
                    <div className="btn btn-primary" onClick={() => navigate(`/field-detail/${field.id.toLowerCase()}`)}>Schedule Irrigation</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
