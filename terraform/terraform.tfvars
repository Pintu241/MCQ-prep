# ─────────────────────────────────────────────────────────
#  terraform.tfvars  —  Your personal settings
#  IMPORTANT: Add this file to .gitignore — do NOT commit it
# ─────────────────────────────────────────────────────────

aws_region        = "ap-south-1"    # Mumbai (closest to Ludhiana)
app_name          = "mcq-prep"
ec2_instance_type = "t3.micro"      # Free tier — 1 vCPU, 1GB RAM

# Get your public IP by running: curl ifconfig.me
your_ip = "117.251.86.152"
