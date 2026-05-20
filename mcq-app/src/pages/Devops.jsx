export default function Devops() {
  const tools = [
    { name: "Git", category: "Version Control", description: "Essential for source control, collaboration, and placement coding workflows." },
    { name: "Docker", category: "Containers", description: "Containerize applications to run consistently across environments." },
    { name: "Kubernetes", category: "Orchestration", description: "Deploy, scale, and manage containerized workloads in production." },
    { name: "Terraform", category: "Infrastructure as Code", description: "Provision cloud infrastructure with reusable, declarative code." },
    { name: "AWS", category: "Cloud Platform", description: "Know core services like EC2, S3, IAM, and networking for cloud placement tasks." },
    { name: "Azure / GCP", category: "Cloud Platform", description: "Understanding alternate cloud providers is a strong plus for interviews." },
    { name: "Jenkins", category: "CI/CD", description: "Build and automate pipelines for continuous integration and delivery." },
    { name: "GitHub Actions", category: "CI/CD", description: "Modern pipeline automation directly in GitHub repositories." },
    { name: "Ansible", category: "Configuration Management", description: "Automate server provisioning and application deployment configuration." },
    { name: "Prometheus", category: "Monitoring", description: "Collect metrics and monitor application health and infrastructure." },
    { name: "Grafana", category: "Visualization", description: "Visualize metrics and build dashboards for deployment monitoring." },
    { name: "Nginx", category: "Web Server", description: "Use as a reverse proxy, load balancer, and static file server." },
    { name: "Linux CLI", category: "Operating System", description: "Command-line fluency is essential for DevOps, deployment, and troubleshooting." },
    { name: "Terraform Cloud / Vault", category: "Security", description: "Understand secrets management and secure IaC workflows." },
    { name: "Docker Compose", category: "Local Dev", description: "Run multi-container apps locally for testing deployment behavior." },
    { name: "Helm", category: "Kubernetes", description: "Package and manage Kubernetes applications using charts." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#07090f", color: "#eef0f8", fontFamily: "'Outfit', sans-serif", padding: 40 }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: "#34d399", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>DevOps Placement Toolkit</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.05 }}>All DevOps tools you should know for placement</h1>
          <p style={{ fontSize: 16, color: "#9ca3af", marginTop: 14, maxWidth: 760 }}>This section lists the core DevOps technologies and tooling recruiters expect for infrastructure, deployment, automation, and production readiness.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          {tools.map((tool) => (
            <div key={tool.name} style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 22, minHeight: 160 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#60a5fa", marginBottom: 10 }}>{tool.category}</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{tool.name}</div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "#d1d5db" }}>{tool.description}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, display: "grid", gap: 18 }}>
          <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>How to use this list</h2>
            <ul style={{ color: "#d1d5db", lineHeight: 1.8, paddingLeft: 20 }}>
              <li>Focus on practical skills: build a sample app with Docker, deploy it with Kubernetes, and provision infrastructure with Terraform.</li>
              <li>Understand pipelines: create CI/CD workflows using Jenkins or GitHub Actions for automatic testing and deployment.</li>
              <li>Practice troubleshooting: learn Linux CLI, logs, and monitoring so you can answer production incident questions.</li>
              <li>Link concepts: explain how source control, containers, IaC, and observability work together in a real deployment.</li>
            </ul>
          </div>

          <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Placement preparation themes</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              {[
                { title: "Automation", text: "Build scripts and pipelines that reduce manual work and ship changes faster." },
                { title: "Reliability", text: "Monitor apps, handle failures, and keep services running under load." },
                { title: "Security", text: "Manage secrets safely and use IAM best practices for access control." },
                { title: "Cloud-native", text: "Deploy scalable systems using containers, orchestration, and managed services." },
              ].map((item) => (
                <div key={item.title} style={{ background: "#0f172a", borderRadius: 14, padding: 18, minHeight: 120 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#93c5fd" }}>{item.title}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.75, color: "#cbd5e1" }}>{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
