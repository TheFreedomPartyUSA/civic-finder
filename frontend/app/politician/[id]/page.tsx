"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PoliticianPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/politician/${id}`)
      .then((res) => res.json())
      .then(setData);
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <main style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Link href="/">← Back</Link>

      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "10px", marginTop: "10px" }}>
        <h1>{data.name}</h1>
        <p><strong>{data.role}</strong></p>
        <p>{data.party} • {data.state}</p>

        <hr />

        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Phone:</strong> {data.phone}</p>
        <p><strong>Office:</strong> {data.office}</p>
      </div>
    </main>
  );
}