import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import Contact from "@/models/Contact";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    await dbConnect();
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    return (
        <div className="container" style={{ paddingTop: "120px", paddingBottom: "50px" }}>
            <h1 className="section-title">Admin Dashboard</h1>

            <div style={{ marginBottom: "4rem" }}>
                <h2>Reviews ({reviews.length})</h2>
                <div className="project-grid">
                    {reviews.map((review) => (
                        <div key={review._id.toString()} className="project-card" style={{ padding: "1.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                                <h3 style={{ fontSize: "1.2rem", margin: 0 }}>{review.name}</h3>
                                <span style={{ color: "#ffd700" }}>{"★".repeat(review.rating)}</span>
                            </div>
                            <p style={{ marginBottom: "1rem" }}>{review.message}</p>
                            <small style={{ color: "#666" }}>{new Date(review.createdAt).toLocaleString()}</small>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2>Messages ({contacts.length})</h2>
                <div className="project-grid">
                    {contacts.map((contact) => (
                        <div key={contact._id.toString()} className="project-card" style={{ padding: "1.5rem" }}>
                            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{contact.name}</h3>
                            <p style={{ color: "var(--accent-color)", marginBottom: "1rem" }}>{contact.email}</p>
                            <p style={{ marginBottom: "1rem" }}>{contact.message}</p>
                            <small style={{ color: "#666" }}>{new Date(contact.createdAt).toLocaleString()}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
